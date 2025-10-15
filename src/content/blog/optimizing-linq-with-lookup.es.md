---
title: "From 3.5 Hours to 30 Minutes: Optimizing C# with LINQ's ToLookup"
description: "A real-world case study of replacing inefficient .Where() loops with ILookup, cutting down a critical process time by 85%."
publishDate: "2025-10-14"
category: "Performance Optimization"
heroImage: "https://images.unsplash.com/photo-1501290301209-7a0323622985?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
---

## The Silent Bottleneck: From Fast Process to 3.5-Hour Nightmare

In software development, some processes are born fast and efficient, but as data grows over time, they turn into real bottlenecks. This was the case with our `AplicarReglasWithAllReferences` method, a crucial component in pension calculations that, over the months, went from running in minutes to taking a staggering **three and a half hours**.

The system became sluggish, users grew impatient, and maintenance became increasingly complex. The culprit wasn't the database or a convoluted business logic, but a very common and dangerously inefficient coding pattern: using `.Where()` on lists inside a `foreach` loop.

## The Anti-Pattern: Death by a Thousand `.Where()` Cuts in a Loop

The original logic was simple and straightforward. At the beginning of the method, we loaded several large lists of related data into memory: policies, people, exceptions, coverages, etc. Then, we iterated through the main list of policies and, for each one, looked up its related data in the other lists.

The code looked something like this:

```csharp
// Large lists of data are loaded at the start
IList<Poliza> allPolicies = dao.GetPolicies();
IList<RuleException> allExceptions = dao.GetExceptions();
IList<Coverage> allCoverages = dao.GetCoverages();

foreach (var poliza in allPolicies)
{
    // For EACH policy, the ENTIRE list of exceptions is scanned again
    var exceptionsForPolicy = allExceptions.Where(e => e.IDPoliza == poliza.IDPoliza).ToList();

    // And the ENTIRE list of coverages is scanned again
    var coveragesForPolicy = allCoverages.Where(c => c.IDPoliza == poliza.IDPoliza).ToList();

    // ...do something with the found data...
}
```

**Why is this so slow?**

The answer lies in computational complexity. A `.Where()` on a list performs a **linear scan (O(N))**. This means that to find an item, it has to check, in the worst case, all N items in the list. If you do this inside a loop that repeats M times, the total complexity skyrockets to **O(N * M)**.

If you have 100,000 policies (M) and 500,000 exceptions (N), the number of operations is astronomical. You're asking the system to read the entire phone book, over and over, for every person you're looking up.

## The Elegant Solution: `ToLookup` as a High-Speed Index

The solution to this problem is one of LINQ's most powerful and underrated methods: `ToLookup()`.

`ToLookup` transforms a list into a dictionary-like structure, but optimized for one-to-many relationships. It works like a book's index: instead of reading the entire book to find a term, you go directly to the correct page.

Implementing this change is surprisingly simple:

1.  **One-Time Indexing Cost:** Before entering the loop, you convert your secondary data lists into an `ILookup`. This has an initial cost of O(N) to create the index.
2.  **Instantaneous Lookups:** Inside the loop, you replace the expensive `.Where()` with a direct access to the lookup, which is an almost instantaneous operation (O(1)).

The refactored code looks like this:

```csharp
// Large lists of data are loaded at the start
IList<Poliza> allPolicies = dao.GetPolicies();
IList<RuleException> allExceptions = dao.GetExceptions();
IList<Coverage> allCoverages = dao.GetCoverages();

// 1. The "indexes" are created once before the loop.
var exceptionsLookup = allExceptions.ToLookup(e => e.IDPoliza);
var coveragesLookup = allCoverages.ToLookup(c => c.IDPoliza);

foreach (var poliza in allPolicies)
{
    // 2. The lookup is now instantaneous (O(1)). No more scans.
    var exceptionsForPolicy = exceptionsLookup[poliza.IDPoliza].ToList();
    var coveragesForPolicy = coveragesLookup[poliza.IDPoliza].ToList();

    // ...do something with the found data...
}
```

The total complexity is now **O(N + M)**, a drastic improvement over O(N * M).

## Real-World Results: An 85% Reduction in Execution Time

By applying this technique to our `AplicarReglasWithAllReferences` method, the results were transformative. The process, which used to paralyze the system for **3.5 hours**, now consistently finishes in **approximately 30 minutes**.

This represents an **85% reduction in execution time**, achieved with a minimally invasive yet conceptually powerful code change. We moved from an inefficient algorithm to an optimized one, freeing up system resources and restoring agility to the business process.

## Conclusion

If you have a slow process that works with large collections of data in memory, look for this anti-pattern. You'll likely find `foreach` loops with `.Where()` calls inside. Replacing them with a pre-calculated `ILookup` is one of the most effective optimizations you can implement. Not only will you dramatically reduce execution times, but you'll also make your code cleaner and more readable.
