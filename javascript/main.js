/**
 * Utils function used in the SHA1 calculation.
 * @type {{getStringXTime, xor}}
 */
var Utils = (function () {
    "use strict";

    /**
     * Repeats a string a specified number of time.
     *
     * @example getStringXTime("0", 3) returns "000"
     *
     * @param {string} str The string to repeat.
     * @param {int} count The number of time the string needs to be repeated.
     * @returns {string}
     */
    var getStringXTime = function (str, count) {
        // We increment the count as the join only happens between elements.
        return new Array(count + 1).join(str);
    };

    /**
     * Performs an Exclusive OR (XOR) on 2 binary strings.
     *
     * @example xor('0101', '0011') returns '0110'
     *
     * @param {string} w1
     * @param {string} w2
     * @returns {string}
     */
    var xor = function (w1, w2) {
        var bits1 = w1.split("");
        var bits2 = w2.split("");
        var processed = [];
        for (var i = 0; i < w1.length || i < w2.length; i++) {
            if (bits1[i] !== bits2[i] && (bits1[i] === '1' || bits2[i] === '1' )) {
                processed.push('1');
            } else {
                processed.push('0');
            }
        }
        return processed.join("");
    };

    /**
     * Performs an OR on 2 binary strings.
     *
     * @example or('0101', '0011') returns '0111'
     *
     * @param {string} w1
     * @param {string} w2
     * @returns {string}
     */
    var or = function (w1, w2) {
        var bits1 = w1.split("");
        var bits2 = w2.split("");
        var processed = [];
        for (var i = 0; i < w1.length || i < w2.length; i++) {
            if (bits1[i] === '1' || bits2[i] === '1') {
                processed.push('1');
            } else {
                processed.push('0');
            }
        }
        return processed.join("");
    };

    /**
     * Performs a logical AND on 2 binary strings.
     *
     * @example and('0101', '0011') returns '0001'
     *
     * @param {string} w1
     * @param {string} w2
     * @returns {string}
     */
    var and = function (w1, w2) {
        var bits1 = w1.split("");
        var bits2 = w2.split("");
        var processed = [];
        for (var i = 0; i < w1.length || i < w2.length; i++) {
            if (bits1[i] === '1' && bits2[i] === '1') {
                processed.push('1');
            } else {
                processed.push('0');
            }
        }
        return processed.join("");
    };

    /**
     * Adds (Addition) 2 binary string together and then shift-left or append-left
     * to ensure a specific length is reached.
     *
     * @example and('1010', '1001', 4) returns '0011' (10011 left-shifted to 4 bits)
     *
     * @param {string} w1
     * @param {string} w2
     * @param {int} length
     * @returns {string}
     */
    var add = function (w1, w2, length) {
        var decimalResult = parseInt(w1, 2) + parseInt(w2, 2);
        var binaryResult = decimalResult.toString(2);

        if(binaryResult.length < length) {
            binaryResult =
                getStringXTime("0", length - binaryResult.length) + binaryResult;
        } else if (binaryResult.length > length) {
            binaryResult = binaryResult.substr(binaryResult.length - length);
        }

        return binaryResult;
    };

    /**
     * Performs a logical NOT on a binary string.
     *
     * @example not('0101') returns '1010'
     *
     * @param {string} w1
     * @returns {string}
     */
    var not = function (w1) {
        var bits1 = w1.split("");
        var processed = [];
        for (var i = 0; i < w1.length; i++) {
            if (bits1[i] === '0') {
                processed.push('1');
            } else {
                processed.push('0');
            }
        }
        return processed.join("");
    };

    /**
     * Rotate a string a defined number of times.
     * The rotation consist of taking the first character and putting it at the end.
     *
     * @example rotate("abc", 1) returns "bca"
     * @example rotate("abc", 2) returns "cab"
     *
     * @param {string} str
     * @param {int} count
     * @returns {string}
     */
    var rotate = function (str, count) {
        if (count === 0) {
            return str;
        }

        var arr = str.split("");
        arr.push(arr.splice(0, 1)[0]);
        return rotate(arr.join(""), count - 1);
    };

    /**
     * Converts a binary string to its Hexadecimal equivalent and then appends zeros
     * to ensure a minimum length is required.
     *
     * @param str The binary string.
     * @param length The minimum length of the result string.
     * @returns {string}
     */
    var binToHex = function(str, length) {
        str = parseInt(str, 2).toString(16);
        if(str.length < 8) {
            str = Utils.getStringXTime("0", length - str.length) + str;
        }
        return str;
    };

    return {
        getStringXTime: getStringXTime,
        or: or,
        and: and,
        not: not,
        xor: xor,
        add: add,
        rotate: rotate,
        binToHex: binToHex
    };
})();

/**
 * SHA1 hash algorithm implementation explained.
 * @type {{sha1}}
 */
var Main = (function () {
    'use strict';

    /**
     * Hash a string with the SHA1 algorithm.
     *
     * @param {string} str The string to hash
     * @returns string
     */
    var sha1 = function (str) {
        // Step 1: Break the string into characters
        var step1_split = str.split("");

        // Step 2: Get the ASCII code of each character
        var step2_to_ascii_code = step1_split.map(function (c) {
            return c.charCodeAt(0);
        });

        // Step 3: Convert the ASCII code to Binary
        var step3_ascii_binary = step2_to_ascii_code.map(function (c) {
            return c.toString(2);
        });

        // Step 4: Prepend `0` where needed to get binaries with length of 8
        var step4_ascii_binary_8_length = step3_ascii_binary.map(function (c) {
            if (c.length < 8) {
                c = Utils.getStringXTime('0', 8 - c.length) + c;
            }
            return c;
        });

        // Step 5: Combine the values we have
        var step5_combine_str = step4_ascii_binary_8_length.join("");

        // Step 6: Append a "1" at the end.
        var step6_append_1 = step5_combine_str + '1';

        // Step 7: Prepend 0 to have Length % 512 = 448
        // We want a leftover of 448 as we will add after an extra 64 chars making it
        // Length % 512 = 0 letting us split the value in a exact number of 512 chunks.
        var step7_modulo_512_is_448 = (function (str) {
            var currentModulo = str.length % 512;

            if (currentModulo < 448) {
                // If in the range 0-447 we just need to append `448-currentModulo` zeros.
                str += Utils.getStringXTime('0', 448 - currentModulo);
            } else if (currentModulo > 448) {
                // If in the range 449-511 we need to append `512-currentModule + 448` zeros.
                str += Utils.getStringXTime('0', 512 - currentModulo + 448);
            }

            return str;
        })(step6_append_1);

        // Step 8: Append the step 5 length as a 64bit binary string.
        var step8_append_step5_length = (function (str, step5) {
            var step5BinaryLength = step5.length.toString(2);
            // Append Zeros to make it on 64 bit.
            // Remember, SHA1 only supports inputs up to 2^64 - 1.
            step5BinaryLength = Utils.getStringXTime('0', 64 - step5BinaryLength.length) + step5BinaryLength;

            return str + step5BinaryLength;
        })(step7_modulo_512_is_448, step5_combine_str);

        // Step 9: Split into 512 long chunks.
        var step9_split_512b_chunks = (function (str) {
            var chunks = [];
            while (str.length > 0) {
                chunks.push(str.substr(0, 512));
                str = str.substr(512);
            }
            return chunks;
        })(step8_append_step5_length);

        // Step 10: Split each chunks into 32bits words
        var step10_split_32b_words = step9_split_512b_chunks.map(function (chunk) {
            var words = [];
            while (chunk.length > 0) {
                words.push(chunk.substr(0, 32));
                chunk = chunk.substr(32);
            }
            return words;
        });

        // Step 11: Generate words to get 80 Words per chunk instead of 16.
        var step11_80_words_per_chunk = (function (chunks) {
            // For each chunks
            for (var i = 0; i < chunks.length; i++) {
                var words = chunks[i];
                // Generate new words until words.length === 80
                for (var j = 16; words.length < 80; j++) {
                    // We XOR 4 words together to generate a new one.
                    // We start at index 16 and use j-3 XOR j-8 XOR j-14 XOR j-16
                    var tmp = Utils.xor(words[j - 3], words[j - 8]);
                    tmp = Utils.xor(tmp, words[j - 14]);
                    tmp = Utils.xor(tmp, words[j - 16]);

                    // Finally we rotate the new word
                    tmp = Utils.rotate(tmp, 1);
                    words.push(tmp);
                }
            }

            return chunks;
        })(step10_split_32b_words);

        // Step 12: Variable that will serve as base for the hashing algorithm.
        var h0 = '01100111010001010010001100000001'; // 0x67452301
        var h1 = '11101111110011011010101110001001'; // 0xEFCDAB89
        var h2 = '10011000101110101101110011111110'; // 0x98BADCFE
        var h3 = '00010000001100100101010001110110'; // 0x10325476
        var h4 = '11000011110100101110000111110000'; // 0xC3D2E1F0

        // Step 13: Process each words (mostly additions and rotations)
        // to reduce it to a set of 5 32bits binary string.
        step11_80_words_per_chunk.forEach(function (words) {
            var a = h0;
            var b = h1;
            var c = h2;
            var d = h3;
            var e = h4;

            // For each Chunk we process the 80 words
            for (var i = 0; i < 80; i++) {
                if (i < 20) {
                    // f = (b and c) or ((not b) and d)
                    var f =
                        Utils.or(
                            Utils.and(b, c),
                            Utils.and(
                                Utils.not(b),
                                d
                            )
                        );
                    var k = '01011010100000100111100110011001';
                } else if (i < 40) {
                    // f = b XOR c XOR d
                    f = Utils.xor(Utils.xor(b, c), d);
                    k = '01101110110110011110101110100001'
                } else if (i < 60) {
                    // f = (b and c) or (b and d) or (c and d)
                    f =
                        Utils.xor(
                            Utils.xor(
                                Utils.and(b, c),
                                Utils.and(b, d)
                            ),
                            Utils.and(c, d)
                        );
                    k = '10001111000110111011110011011100';
                } else {
                    // f = b XOR c XOR d
                    f = Utils.xor(Utils.xor(b, c), d);
                    k = '11001010011000101100000111010110';
                }

                var tmp = Utils.rotate(a, 5);
                tmp = Utils.add(tmp, f, 32);
                tmp = Utils.add(tmp, e, 32);
                tmp = Utils.add(tmp, k, 32);
                tmp = Utils.add(tmp, words[i], 32);
                e = d;
                d = c;
                c = Utils.rotate(b, 30);
                b = a;
                a = tmp;
            }

            h0 = Utils.add(h0, a, 32);
            h1 = Utils.add(h1, b, 32);
            h2 = Utils.add(h2, c, 32);
            h3 = Utils.add(h3, d, 32);
            h4 = Utils.add(h4, e, 32);
        });

        // Step 14: We reduce the 5 remaining strings by concatenating their hexadecimal
        // values.
        // Depending on the tool / platform, a SHA1 may also be given as a BASE64 ASCII
        // string.
        var step14_finalize =
            Utils.binToHex(h0, 8) +
            Utils.binToHex(h1, 8) +
            Utils.binToHex(h2, 8) +
            Utils.binToHex(h3, 8) +
            Utils.binToHex(h4, 8)
        ;

        return step14_finalize;
    };

    return {
        sha1: sha1
    };
})();

console.log(Main.sha1('Hello World'));

