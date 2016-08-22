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
     * Performs a Exclusive OR (XOR) on 2 binary strings.
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
        if(count === 0) {
            return str;
        }

        var arr = str.split("");
        arr.push(arr.splice(0, 1)[0]);
        return rotate(arr.join(""), count - 1);
    };

    return {
        getStringXTime: getStringXTime,
        xor: xor,
        rotate: rotate
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
        var step11_80_words_per_chunk = (function(chunks){
            // For each chunks
            for(var i = 0; i < chunks.length; i++) {
                var words = chunks[i];
                // Generate new words until words.length === 80
                for(var j = 16; words.length < 80; j++){
                    // We XOR 4 words together to generate a new one.
                    // We start at index 16 and use j-3 XOR j-8 XOR j-14 XOR j-16
                    var tmp = Utils.xor(words[j-3], words[j-8]);
                    tmp = Utils.xor(tmp, words[j-14]);
                    tmp = Utils.xor(tmp, words[j-16]);

                    words.push(tmp);
                }
            }

            return chunks;
        })(step10_split_32b_words);

        // Step 12: Rotate each word of each chunk 1 time
        var step12_rotate_words = step11_80_words_per_chunk.map(function(chunk){
            return chunk.map(function (word) {
               return Utils.rotate(word, 1);
            });
        });

        // TODO: Finish implementation!

        return step12_rotate_words;
    };

    return {
        sha1: sha1
    };
})();

console.log(Main.sha1('A Test'));