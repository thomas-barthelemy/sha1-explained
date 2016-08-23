SHA-1 Algorithm Step-by-step implementation
===========================================

What?
-----
This repository contains simple implementation of the SHA1
hashing algorithm.

All steps a separated with comments to help understand what is
really happening and letting you debug/log at the different
stages of the process.

If you are looking for a more summarized view / pseudocode of the
algorithm I'll recommend having a look at the
[SHA1 Wikipedia Page](https://en.wikipedia.org/wiki/SHA-1).

Why?
----
There is no specific reason as to why a SHA1 over SHA2 for example,
I just found the overall algorithm to be interesting and a good exercise
for people looking into a new programming / scripting language.

There is already a function/operator for...
-------------------------------------------
The clear goal here is just about understanding, as such I found it
better for people to see actual implementation of the binary operators
(or, xor, and...), and to sometime split code that could be factorized.
This is definitely not the best solution if you are looking for performances.

SHA1, Security, Bad
-------------------
SHA1 as a hashing algorithm is deprecated, use `SHA-256` instead.
Note: There are plenty use-case for hashing algorithm resulting
in plenty levels of speed<--->safety.
Very fast / less secure algorithm like `CRC-32` are good to check for
corrupted data while slower / more secure algorithm like `bcrypt` are
best used for password hashing.

