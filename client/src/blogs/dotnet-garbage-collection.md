---
slug: dotnet-garbage-collection
title: A Beginner-Friendly Guide to Garbage Collection in .NET 
date: 2025-12-28
tags: [".NET", ".NET Garbage Collection", "Memory Leaks", "C# Advanced"]
---


When we start learning any programming language, we focus on it's syntax, execution process, and other nitty-gritty things that helps us implement our business logic and get our work done. As a beginner, it's perfect! as it is, but when we are done with those "important" things, we should focus on the backend of it, especially the memory part, which most of us very easily ignore until one day, it came staring to us in some kind of production issue, or maybe during interview process, or when we became curious and ask questions.

And this is what we are going to focus on, basically Garbage Collection in .NET and some of it's nuances, atleast we'll be clear with the basics if not become expert at managing it at scale.

### What it is?
.NET Garbage Collection is the process in which CLR clears up memory which is occupied by objects that are no longer reachable by application.

### Who Does this?
.NET package comes along with it's CLR, that's Common Language Runtime, basically the engine that lets us execute our .NET program efficiently over machines. One of many other responsibilities of CLR is Garbage Collection.

When the variables used in our process go out of scope, the objects they reference may become unreachable, CLR takes them up and set them aside for cleaning up when the GC cycle is exceuted.

The timing of garbage collection cycles (GC cycle) is non-deterministic in nature, hence we only take care of using memory efficiently than managing it, as CLR can handle it on it's own.

### Garbage Collection generations in .NET

Garbage Colllection generations are like tiers, there are 3 - Gen 0, Gen 1, Gen 2.

- If it's a short-lived object, it goes to Gen 0, Cleaned up frequently
- If it's a medium-lived object, it goes to Gen 1 via promotion from Gen 0.
- If it's a long-lived object, it goes to Gen 2 via promotion from Gen 1, cleaned up rarely.

During Garbage Collection, scanning of these generations is done, and objects present in these generation are cleaned up if they are unreachable. 

The interval between the subsequent scanning is incremental as we go from Gen 0, Gen 1 and Gen 2 in that order respectively.

The time it takes to scan Gen 0 is fast as it's a small size heap and this makes the app more responsive.

Objects are promoted from one generation to another by CLR it'self. Here's how it works - 

When we create any object/variable, some memory is allocated to it and CLR put that object in Gen 0. 
Now when the cleanup cycle is executed by CLR, and the object we have created has gone out of scope(or became unreachable), it's cleaned up, otherwise, it is promoted to Gen 1, and subsequently to Gen 2.

### Large Object Heap(LOH)

Apart from three generation, we have Large Object Heap, it's a part of managed heap in.NET and bascially used for storing large object (size >=85 KB). 

LOH objects are treated as part of Gen 2 and hence less frequent cleanup by CLR. One of many reasons to avoid creating such large objects.

Let's suppose we have a service that processes image by converting it in byte[], and the size of each image is 1 MB, so these arrays will be stored in LOH and over time, as the memory usage grows, during GC cycle, our service can experience temporary slowness.

### Significance of Memory Usage/Garbage Collection

Writing efficient code that takes less memory or efficiently uses memory is extremely important when we deal with things at scale.
CLR is responsible for managing memory but as we have seen above, we still need to take precautions like creating short-lived objects, small sized objects, disposing variable properly etc.

Intermittent Pauses - 
    - Our Application becomes unresponsive temporarily. HTTP requests take longer than usual or UI freezes for short time, then resumes normally. This is one sign that the GC is cleaning up LOH/Gen 2 collections which is large and is taking time.
    - We need to use tool like PerfView to see the frequency of GC cycles, pause durations and object lifetimes.
    - We need to enable see if we should enable server GC or Workstation GC based on our usage patterns.

### What triggers GC?

GC cycle is executed when .NET detects memory pressure, that is when there isn't enough free memory for new objects

It doesn't run continuously as it needs scanning the memory generations, and that is
expensive and cause pause in application.


### Example & Doubts - 


```csharp
public void Process()
{
    var list = new List<int>();
    for (int i = 0; i < 1000; i++)
    {
        list.Add(i);
    }
}
```

### What will happen to list object and the memory is occupies after Process() is finished?

When the Process() is executed, the list object will go out of scope and hence become unreachable, so it will be eligible for cleaning up during next GC cycle. Now when the next GC cycle runs (when CLR detects memory pressure), it will clean up this list object and memory is freed after that only.


### To which generation this list object will belong?
Here list object is storing 1000 integers, totaling for 4 bytes * 1000 = 4000 bytes. it's less than 85 Kb, so it's not eligible for LOH, it will be allocated in Gen 0 as it's a newly created small object.

### What will be happen if the list object survives Gen 0 Garbage Collection?
If GC cycle runs and the object is still reachable (not out of scope), it will not be collected and hence it will not be cleaned up, instead it will be promoted to Gen 1, as GC assumes that this object is likely to live longer.
This happens so that Gen 0 size remains small and it's scanning is fast and frequent.

### Conclusion

Garbage Collection in .NET is designed to make memory management easier. As developers, we don’t control when GC cycle runs, but our code strongly influences how often it runs and how expensive it becomes(memory-wise).

Understanding concepts like reachability, generations, and the Large Object Heap helps us write more predictable and performant applications, especially as systems grow in scale.

You don’t need to manually manage memory in .NET, but being mindful of object lifetimes, allocation patterns, and large objects can save you from production issues and confusing performance issues.
