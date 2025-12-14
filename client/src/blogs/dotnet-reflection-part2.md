---
slug: dotnet-reflection-part2
title: How to Use Reflection in .NET - A Beginner's Implementation Guide (Part 2)
date: 2025-12-14
tags: [".NET", ".NET Reflection", "C# Advanced"]
---




Continuing with our previous part, we'll directly jump on the implementation aspects of Reflection in .NET here.
If you haven't gone through the basics from Part-1, please go through it for the context.
We''ll cover most of the relevant aspects of using Reflection here.

### Loading Assemblies at Runtime

Implementation of Reflection, almost always starts with accessing the assembly(.dll files).
Sometimes we have assemblies but no access to their source code directly(when we can't navigate through its classes, interfaces etc. like we do normally with F12, F11). So to use that, we need to load the required assembly.

```csharp
using System;
using System.Reflection;

// Let's assume we have this "RandomLibrary" that we need to utilize,
// We need to load it first

Assembly asm = Assembly.LoadFrom("RandomLibrary.dll");
foreach (Type type in asm.GetTypes())
{
    Console.WriteLine(type.FullName); //Prints the name of the library
}
```

This will load the required library, and now we can start inspecting it, using it.
### Type Discovery
Once the assembly is loaded, the next step is to identify the type you want to work with.
After loading the assembly we need to work with, as C# is full of classes and interfaces. We need to load the type.

```csharp
using System;
using System.Reflection;

// Let's assume we have this "RandomLibrary" that we need to utilize,
// We need to load it first

Assembly asm = Assembly.LoadFrom("RandomLibrary.dll");

// We use "GetType" to access the types
Type type = asm.GetType("RandomLibrary.SomeFunction");

if (type == null) 
  throw new Exception("Type not found");

//Prints the details of the type
Console.WriteLine($"Name: {t.Name}, Namespace: {t.Namespace}");
```

Now you notice, we have hard coded the type name here, that's a requirement. This has potential exception risks like type is not present in that assembly, so it will throw exceptions and we need to handle those scenarios.

### Instance Creation, dynamically!
Reflection lets you create objects at runtime without using new().
Now that we have loaded our assembly and extracted the type, we need to create instance of it, to use it. Normally we use new() to create instances and access its properties and method, but in Reflection, its a bit different.

```csharp
using System;
using System.Reflection;

Assembly asm = Assembly.LoadFrom("RandomLibrary.dll");
Type type = asm.GetType("RandomLibrary.SomeFunction");

// Creating Instance here using Activator.CreateInstance, instead of using new()
object obj = Activator.CreateInstance(type);

Console.WriteLine($"Instance created of: {obj.GetType().Name}");
```

As we created the instance of our type, we can access its methods, and properties.

### Accessing Public Methods
With an instance, you can invoke methods directly using reflection.
Lets assume we have a method like this -
```csharp
public string Print(){
  return "Hey There!";
}
using System;
using System.Reflection;

Assembly asm = Assembly.LoadFrom("RandomLibrary.dll");
Type type = asm.GetType("RandomLibrary.SomeFunction");
object obj = Activator.CreateInstance(type);

//Return Type is "MethodInfo", and "GetMethod" is used to access the method
MethodInfo method = type.GetMethod("Print");

// .Invoke is used to execute the method
object result = method.Invoke(obj);

Console.WriteLine(result); //Hey There!
```

### Accessing Private/Protected Method
Reflection allows bypassing access modifiers with BindingFlags.
Ok so in case we have these modifier on the methods, we need to bypass these in order to use it, for that we use BindingFlags. Since, this way Reflection allows us to invoke private/protected methods, testing framework are able to mock these methods.
This should be done only for testing/debugging purposes, and must be avoided for production code.

```csharp
using System;
using System.Reflection;

Assembly asm = Assembly.LoadFrom("RandomLibrary.dll");
Type type = asm.GetType("RandomLibrary.SomeFunction");
object obj = Activator.CreateInstance(type);

//Bypassing Access modifier using BindingFlags.NonPublic
//For Instance method we use BindingFlags.Instance, for static, it will be BindingFlags.Static
//These two param are joined together with '|' symbol.
MethodInfo method = type.GetMethod("PrivateMethod", BindingFlags.NonPublic | BindingFlags.Instance);

// .Invoke is used to execute the method.
// Note that invoke is called on the method and not on object
object result = method.Invoke(obj);

Console.WriteLine(result); //Hey There!

```
### Accessing Properties
Reflection allows us to get and set the values of the properties of the type dynamically.
```csharp
using System;
using System.Reflection;

Assembly asm = Assembly.LoadFrom("RandomLibrary.dll");
Type type = asm.GetType("RandomLibrary.SomeFunction");
object obj = Activator.CreateInstance(type);

//Return Type - PropertyInfo
// Method - GetProperty()
PropertyInfo prop = type.GetProperty("Name"); //or GetProperties() for all properties

//SetValue is called on prop, and obj is passed as a param
prop.SetValue(obj, "Heisenberg"); 

Console.WriteLine(prop.GetValue(obj));
```
### Accessing Fields
Reflection also allows us to access fields defined in our type, both public and private ones.
```csharp
using System;
using System.Reflection;

Assembly asm = Assembly.LoadFrom("RandomLibrary.dll");
Type type = asm.GetType("RandomLibrary.SomeFunction");
object obj = Activator.CreateInstance(type);

//Return Type - FieldInfo
//Method - GetField, called on type
//Using BindingFlags.NonPublic | BindingFlags.Instance to access private/protected ones

FieldInfo field = type.GetField("_internalId", BindingFlags.NonPublic | BindingFlags.Instance);
field.SetValue(obj, 1001);

Console.WriteLine(field.GetValue(obj));
```

### Accessing Attributes
Attributes are metadata of classes/properties or methods. We rely on custom attributes for validating, routing, mapping etc.
Reflection gives us the ability to inspect these attributes during runtime. Commonly used in ORMs, MVC routing, DI.

```csharp
//Custom Attribute class
[AttributeUsage(AttributeTargets.All)]
class CustomAttribute : Attribute
{
    public string Name { get; }
    public int Version { get; set; }

    public CustomAttribute(string name)
    {
        Name = name;
    }
}

//Applying attribute here
[Custom("CustomMetadata", Version = 1)]
class MyClass
{
    public void Print() => Console.WriteLine("Hello");

    [Custom("Method", Version = 2)]
    public void SomeFunction([Custome("Param", Version = 3)] string name)
    {
        Console.WriteLine($"Hello, {name}");
    }
}
using System;
using System.Reflection;

Assembly asm = Assembly.LoadFrom("RandomLibrary.dll");
Type type = asm.GetType("RandomLibrary.SomeFunction");

//Method - GetCustomAttributes()
//inherit: false → only attributes on the current class and not on base class
var attrs = type.GetCustomAttributes(typeof(CustomAttribute), inherit: false);
if (attrs.Length > 0)
{
  CustomAttribute info = (CustomAttribute)attrs[0];
  Console.WriteLine($"Name: {info.Name}, Version: {info.Version}");
}
else
{
  Console.WriteLine("Attribute not found.");
}
```
If we have attributes applied on the paramteres inside the methods.

```csharp
MethodInfo method = type.GetMethod("SomeFunction");
// Parameter-level attribute
var parameters = method.GetParameters();

//Looping over each param
foreach (var param in parameters)
{
  //fetching separately for each of the param
  var paramAttributes = param.GetCustomAttributes(typeof(CustomAttribute), false);
  foreach (CustomAttribute attr in paramAttributes)
  {
    Console.WriteLine($"Parameter '{param.Name}' Attribute -> Name: {attr.Name}, Version: {attr.Version}");
  }
 }

```
### Executing Methods with Params
In case when we have overloaded methods with params, we pass a Type[] object. The invocation patterns also changes to include the values of the params after creating instance of object[].
```csharp
class Calculator
{
    public int Add(int a, int b) => a + b;
    public double Add(double a, double b) => a + b;
}
using System;
using System.Reflection;

Type type = asm.GetType("Calculator");

object calc = Activator.CreateInstance(type);

// Invoke Add(int, int)
MethodInfo addInt = type.GetMethod("Add", new Type[] { typeof(int), typeof(int) });
var result1 = addInt.Invoke(calc, new object[] { 2, 3 });
Console.WriteLine(result1); // 5

// Invoke Add(double, double)
MethodInfo addDouble = type.GetMethod("Add", new Type[] { typeof(double), typeof(double) });
var result2 = addDouble.Invoke(calc, new object[] { 2.0, 3.0 });
Console.WriteLine(result2); // 5.0
```

In case we have, simple methods with param, we don't need to specify the types while getting the method.
```csharp
class Sample
{
    public void PrintMessage(string message)
    {
        Console.WriteLine($"Message: {message}");
    }
}

// No Types mentioned separately
MethodInfo method = type.GetMethod("PrintMessage");

// Invoke method
//Passing param value inside the object[] instance
method.Invoke(obj, new object[] { "Hello Reflection!" });
```

### Handling Exceptions
As we have seen that Reflection code is a bit complex than routine code that we write, and it deals with types at runtime, exception handling becomes utmost requirement.
Always wrap the Reflection code in try-catch blocks with proper null checks for the types, method, properties.
In case we are not aware of the type names or property names or field name, we should first fetch their names using `GetTypes()`, `GetMethods()`, or `GetProperties()` and then invoke or access.
There are few exception that we should take note off.
1. TypeLoadException - Occurs when runtime cannot load the specified type.
2. MissingMethodException- occurs when we try to invoke a method that does not exist.
3. MissingFieldException/ MissingMemberException- Occurs when we try to access properties/fields that does not exist.
4. TargetInvocationException- Occurs when the method we invoked results in exception.
5. AmbigousMatchException- Occurs when multiple overload of a method match and runtime can't decide which one to call.

With this, we have covered relevant aspects required to implement or work with Reflection in .NET.