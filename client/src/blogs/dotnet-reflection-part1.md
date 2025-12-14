---
slug: dotnet-reflection-part1
title: A Beginner-Friendly Guide to .NET Reflection - Part 1
date: 2025-12-12
tags: [".NET", ".NET Reflection", "C# Advanced"]
---


\.NET Reflection is one of those topics in .NET that most developers have heard of, many have used it indirectly, but few feel confident about it. Most of us feel like, "have some idea but not sure".  
Here, I am sharing a 3-part series to help you understand it in the simplest way possible. By the end, you'll go from "have some idea but not sure" to ".NET Reflection? I know how it works".  
Today we'll discuss the objective of reflection, what it is, when to use it, and when to avoid it.

### What it is?
.NET Reflection gives us the ability to inspect metadata (assemblies, types) at runtime and optionally execute methods or modify properties dynamically.  
Let's assume we have a class:

```csharp
public class Person
{
    public string Name { get; set; }

    public void SayHello()
    {
        Console.WriteLine($"Hello, my name is {Name}");
    }
}

```

Without Reflection, we'll use it like this -

```csharp
var p = new Person();
p.Name = "Aditya";
p.SayHello();
```

With Reflection:

```csharp
using System;
using System.Reflection;

class Program
{
    static void Main()
    {
        // Load the type (class)
        Type type = typeof(Person);

        // Create object (instance) dynamically
        object obj = Activator.CreateInstance(type);

        // Set property "Name"
        PropertyInfo prop = type.GetProperty("Name");
        prop.SetValue(obj, "Aditya");

        // Call method "SayHello"
        MethodInfo method = type.GetMethod("SayHello");
        method.Invoke(obj, null);
    }
}
```

### Why use Reflection?
We never used `new()` directly to create an instance; Reflection handled it.  
We didn't access the property directly; Reflection handled it.  
We didn't call the function directly; Reflection handled it.

Reflection is useful in these scenarios:

- Dynamic Type Discovery – when the type is not known at compile time (so you can't create an instance directly using `new`) or when working with unknown assemblies (.dlls) without source code.
- Metadata Inspection – perform actions based on attributes by fetching metadata at runtime.
- Serialization/ORM – serializers like Newtonsoft.Json, System.Text.Json, XMLSerializer use Reflection behind the scenes.
- Testing/Proxies – generate proxies or access private/protected members for testing or debugging.

### Drawbacks of Reflection
- Dynamic type handling can lead to runtime exceptions if not carefully managed.
- Reflection calls are slower than direct calls, so avoid in performance-critical paths.
- Code can become more complex, harder to understand and debug.

> CONCLUSION:
Reflection should be reserved for dynamic scenarios at runtime. In the next part, we'll dive deeper into practical implementation: loading assemblies, invoking methods, and working with attributes.