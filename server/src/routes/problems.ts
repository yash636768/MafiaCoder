import express from 'express';
import Problem from '../models/Problem';

const router = express.Router();

// Get All Problems (with filtering)
router.get('/', async (req, res) => {
    try {
        const { difficulty, tag, company } = req.query;
        let query: any = {};
        if (difficulty) query.difficulty = difficulty;
        if (tag) query.tags = tag;
        if (company) query.companies = company;

        const problems = await Problem.find(query).select('-testCases -editorial');
        res.json(problems);
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server error');
    }
});

// Get Single Problem by Slug
router.get('/:slug', async (req, res) => {
    try {
        const problem = await Problem.findOne({ slug: req.params.slug }).select('-testCases.isHidden');
        if (!problem) return res.status(404).json({ msg: 'Problem not found' });
        res.json(problem);
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server error');
    }
});

// Create Problem (Admin only - middleware needed)
router.post('/', async (req, res) => {
    try {
        const newProblem = new Problem(req.body);
        const problem = await newProblem.save();
        res.json(problem);
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server error');
    }
});

// Enhanced Seed Problems with Company-Wise Data
router.post('/seed', async (req, res) => {
    try {
        await Problem.deleteMany({});

        const problems = [
            // Google Problems
            {
                title: "Two Sum",
                slug: "two-sum",
                description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
                difficulty: "Easy",
                tags: ["Array", "Hash Table"],
                companies: ["Google", "Amazon", "Microsoft", "Meta", "Apple"],
                inputFormat: "nums = [2,7,11,15], target = 9",
                outputFormat: "[0,1]",
                constraints: "2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9",
                examples: [{ input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9" }]
            },
            {
                title: "Trapping Rain Water",
                slug: "trapping-rain-water",
                description: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
                difficulty: "Hard",
                tags: ["Array", "Two Pointers", "Dynamic Programming", "Stack"],
                companies: ["Google", "Amazon", "Goldman Sachs"],
                inputFormat: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
                outputFormat: "6",
                constraints: "n == height.length, 1 <= n <= 2 * 10^4",
                examples: [{ input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explanation: "The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped." }]
            },
            {
                title: "Longest Consecutive Sequence",
                slug: "longest-consecutive-sequence",
                description: "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.",
                difficulty: "Medium",
                tags: ["Array", "Hash Table", "Union Find"],
                companies: ["Google", "Amazon", "Microsoft"],
                inputFormat: "nums = [100,4,200,1,3,2]",
                outputFormat: "4",
                constraints: "0 <= nums.length <= 10^5",
                examples: [{ input: "nums = [100,4,200,1,3,2]", output: "4", explanation: "The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4." }]
            },
            {
                title: "Number of Islands",
                slug: "number-of-islands",
                description: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
                difficulty: "Medium",
                tags: ["Array", "DFS", "BFS", "Union Find"],
                companies: ["Amazon", "Google", "Microsoft", "Meta"],
                inputFormat: "grid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]",
                outputFormat: "1",
                constraints: "m == grid.length, n == grid[i].length",
                examples: [{ input: "See description", output: "1", explanation: "" }]
            },
            {
                title: "Reorganize String",
                slug: "reorganize-string",
                description: "Given a string s, rearrange the characters of s so that any two adjacent characters are not the same. Return any possible rearrangement of s or return \"\" if not possible.",
                difficulty: "Medium",
                tags: ["Hash Table", "String", "Greedy", "Heap"],
                companies: ["Amazon", "Google"],
                inputFormat: "s = \"aab\"",
                outputFormat: "\"aba\"",
                constraints: "1 <= s.length <= 500",
                examples: [{ input: "s = \"aab\"", output: "\"aba\"", explanation: "" }]
            },
            {
                title: "Koko Eating Bananas",
                slug: "koko-eating-bananas",
                description: "Koko loves to eat bananas. There are n piles of bananas, the ith pile has piles[i] bananas. The guards have gone and will come back in h hours. Return the minimum integer k such that she can eat all the bananas within h hours.",
                difficulty: "Medium",
                tags: ["Array", "Binary Search"],
                companies: ["Amazon", "Google", "Meta"],
                inputFormat: "piles = [3,6,7,11], h = 8",
                outputFormat: "4",
                constraints: "1 <= piles.length <= 10^4",
                examples: [{ input: "piles = [3,6,7,11], h = 8", output: "4", explanation: "" }]
            },
            {
                title: "Longest Substring Without Repeating Characters",
                slug: "longest-substring-without-repeating-characters",
                description: "Given a string s, find the length of the longest substring without repeating characters.",
                difficulty: "Medium",
                tags: ["Hash Table", "String", "Sliding Window"],
                companies: ["Google", "Amazon", "Meta", "Microsoft"],
                inputFormat: "s = \"abcabcbb\"",
                outputFormat: "3",
                constraints: "0 <= s.length <= 5 * 10^4",
                examples: [{ input: "s = \"abcabcbb\"", output: "3", explanation: "The answer is \"abc\", with the length of 3." }]
            },
            {
                title: "Median of Two Sorted Arrays",
                slug: "median-of-two-sorted-arrays",
                description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
                difficulty: "Hard",
                tags: ["Array", "Binary Search", "Divide and Conquer"],
                companies: ["Google", "Amazon", "Microsoft"],
                inputFormat: "nums1 = [1,3], nums2 = [2]",
                outputFormat: "2.00000",
                constraints: "nums1.length == m, nums2.length == n",
                examples: [{ input: "nums1 = [1,3], nums2 = [2]", output: "2.00000", explanation: "merged array = [1,2,3] and median is 2." }]
            },

            // Amazon Problems
            {
                title: "Reverse Linked List",
                slug: "reverse-linked-list",
                description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
                difficulty: "Easy",
                tags: ["Linked List", "Recursion"],
                companies: ["Amazon", "Microsoft", "Meta", "Apple"],
                inputFormat: "head = [1,2,3,4,5]",
                outputFormat: "[5,4,3,2,1]",
                constraints: "The number of nodes in the list is the range [0, 5000]",
                examples: [{ input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]", explanation: "" }]
            },
            {
                title: "Merge Two Sorted Lists",
                slug: "merge-two-sorted-lists",
                description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.",
                difficulty: "Easy",
                tags: ["Linked List", "Recursion"],
                companies: ["Amazon", "Microsoft", "Google"],
                inputFormat: "list1 = [1,2,4], list2 = [1,3,4]",
                outputFormat: "[1,1,2,3,4,4]",
                constraints: "The number of nodes in both lists is in the range [0, 50]",
                examples: [{ input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]", explanation: "" }]
            },
            {
                title: "LRU Cache",
                slug: "lru-cache",
                description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
                difficulty: "Medium",
                tags: ["Hash Table", "Linked List", "Design"],
                companies: ["Amazon", "Google", "Meta", "Microsoft"],
                inputFormat: "Operations: [\"LRUCache\", \"put\", \"put\", \"get\", \"put\", \"get\"]",
                outputFormat: "[null, null, null, 1, null, -1]",
                constraints: "1 <= capacity <= 3000",
                examples: [{ input: "capacity = 2", output: "See description", explanation: "LRU cache implementation" }]
            },

            // Microsoft Problems
            {
                title: "Valid Parentheses",
                slug: "valid-parentheses",
                description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
                difficulty: "Easy",
                tags: ["String", "Stack"],
                companies: ["Microsoft", "Amazon", "Meta", "Google"],
                inputFormat: "s = \"()\"",
                outputFormat: "true",
                constraints: "1 <= s.length <= 10^4",
                examples: [{ input: "s = \"()\"", output: "true", explanation: "" }]
            },
            {
                title: "Binary Tree Level Order Traversal",
                slug: "binary-tree-level-order-traversal",
                description: "Given the root of a binary tree, return the level order traversal of its nodes' values.",
                difficulty: "Medium",
                tags: ["Tree", "BFS", "Binary Tree"],
                companies: ["Microsoft", "Amazon", "Meta"],
                inputFormat: "root = [3,9,20,null,null,15,7]",
                outputFormat: "[[3],[9,20],[15,7]]",
                constraints: "The number of nodes in the tree is in the range [0, 2000]",
                examples: [{ input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]", explanation: "" }]
            },

            // Meta (Facebook) Problems
            {
                title: "Add Two Numbers",
                slug: "add-two-numbers",
                description: "You are given two non-empty linked lists representing two non-negative integers. Add the two numbers and return the sum as a linked list.",
                difficulty: "Medium",
                tags: ["Linked List", "Math", "Recursion"],
                companies: ["Meta", "Amazon", "Microsoft"],
                inputFormat: "l1 = [2,4,3], l2 = [5,6,4]",
                outputFormat: "[7,0,8]",
                constraints: "The number of nodes in each linked list is in the range [1, 100]",
                examples: [{ input: "l1 = [2,4,3], l2 = [5,6,4]", output: "[7,0,8]", explanation: "342 + 465 = 807" }]
            },
            {
                title: "Product of Array Except Self",
                slug: "product-of-array-except-self",
                description: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].",
                difficulty: "Medium",
                tags: ["Array", "Prefix Sum"],
                companies: ["Meta", "Amazon", "Microsoft", "Apple"],
                inputFormat: "nums = [1,2,3,4]",
                outputFormat: "[24,12,8,6]",
                constraints: "2 <= nums.length <= 10^5",
                examples: [{ input: "nums = [1,2,3,4]", output: "[24,12,8,6]", explanation: "" }]
            },

            // Apple Problems
            {
                title: "Maximum Subarray",
                slug: "maximum-subarray",
                description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
                difficulty: "Medium",
                tags: ["Array", "Divide and Conquer", "Dynamic Programming"],
                companies: ["Apple", "Amazon", "Microsoft", "Google"],
                inputFormat: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
                outputFormat: "6",
                constraints: "1 <= nums.length <= 10^5",
                examples: [{ input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." }]
            },

            // Goldman Sachs Problems
            {
                title: "Best Time to Buy and Sell Stock",
                slug: "best-time-to-buy-and-sell-stock",
                description: "You are given an array prices where prices[i] is the price of a given stock on the ith day. Maximize your profit by choosing a single day to buy and a different day to sell.",
                difficulty: "Easy",
                tags: ["Array", "Dynamic Programming"],
                companies: ["Goldman Sachs", "Amazon", "Microsoft"],
                inputFormat: "prices = [7,1,5,3,6,4]",
                outputFormat: "5",
                constraints: "1 <= prices.length <= 10^5",
                examples: [{ input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5." }]
            },

            // Uber Problems
            {
                title: "Word Ladder",
                slug: "word-ladder",
                description: "A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that every adjacent pair of words differs by a single letter.",
                difficulty: "Hard",
                tags: ["Hash Table", "String", "BFS"],
                companies: ["Uber", "Amazon", "Google"],
                inputFormat: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
                outputFormat: "5",
                constraints: "1 <= beginWord.length <= 10",
                examples: [{ input: "beginWord = \"hit\", endWord = \"cog\"", output: "5", explanation: "One shortest transformation sequence is \"hit\" -> \"hot\" -> \"dot\" -> \"dog\" -> \"cog\"" }]
            },

            // Adobe Problems
            {
                title: "Merge Intervals",
                slug: "merge-intervals",
                description: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
                difficulty: "Medium",
                tags: ["Array", "Sorting"],
                companies: ["Adobe", "Amazon", "Microsoft", "Google"],
                inputFormat: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
                outputFormat: "[[1,6],[8,10],[15,18]]",
                constraints: "1 <= intervals.length <= 10^4",
                examples: [{ input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]." }]
            },

            // Netflix Problems
            {
                title: "Longest Palindromic Substring",
                slug: "longest-palindromic-substring",
                description: "Given a string s, return the longest palindromic substring in s.",
                difficulty: "Medium",
                tags: ["String", "Dynamic Programming"],
                companies: ["Netflix", "Amazon", "Microsoft"],
                inputFormat: "s = \"babad\"",
                outputFormat: "\"bab\"",
                constraints: "1 <= s.length <= 1000",
                examples: [{ input: "s = \"babad\"", output: "\"bab\"", explanation: "\"aba\" is also a valid answer." }]
            },

            // Walmart Problems
            {
                title: "3Sum",
                slug: "3sum",
                description: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
                difficulty: "Medium",
                tags: ["Array", "Two Pointers", "Sorting"],
                companies: ["Walmart", "Amazon", "Microsoft"],
                inputFormat: "nums = [-1,0,1,2,-1,-4]",
                outputFormat: "[[-1,-1,2],[-1,0,1]]",
                constraints: "3 <= nums.length <= 3000",
                examples: [{ input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]", explanation: "" }]
            },

            // LinkedIn Problems
            {
                title: "Container With Most Water",
                slug: "container-with-most-water",
                description: "You are given an integer array height of length n. Find two lines that together with the x-axis form a container, such that the container contains the most water.",
                difficulty: "Medium",
                tags: ["Array", "Two Pointers", "Greedy"],
                companies: ["LinkedIn", "Amazon", "Google"],
                inputFormat: "height = [1,8,6,2,5,4,8,3,7]",
                outputFormat: "49",
                constraints: "n == height.length, 2 <= n <= 10^5",
                examples: [{ input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "" }]
            },

            // Airbnb Problems
            {
                title: "Letter Combinations of a Phone Number",
                slug: "letter-combinations-of-a-phone-number",
                description: "Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent.",
                difficulty: "Medium",
                tags: ["Hash Table", "String", "Backtracking"],
                companies: ["Airbnb", "Amazon", "Google"],
                inputFormat: "digits = \"23\"",
                outputFormat: "[\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]",
                constraints: "0 <= digits.length <= 4",
                examples: [{ input: "digits = \"23\"", output: "[\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]", explanation: "" }]
            },

            // Stripe Problems
            {
                title: "Group Anagrams",
                slug: "group-anagrams",
                description: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
                difficulty: "Medium",
                tags: ["Array", "Hash Table", "String", "Sorting"],
                companies: ["Stripe", "Amazon", "Microsoft"],
                inputFormat: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]",
                outputFormat: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]",
                constraints: "1 <= strs.length <= 10^4",
                examples: [{ input: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", output: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]", explanation: "" }]
            }
        ];

        await Problem.insertMany(problems);
        res.json({ msg: `Seeded ${problems.length} company-wise problems successfully`, count: problems.length });
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server error');
    }
});

import axios from 'axios';

// ... (existing imports)

// Helper to parse CSV line handling quotes
function parseCSVLine(line: string): string[] {
    const values: string[] = [];
    let currentValue = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            values.push(currentValue.trim());
            currentValue = '';
        } else {
            currentValue += char;
        }
    }
    values.push(currentValue.trim());
    return values;
}

// Seed Problems from GitHub (Company-wise)
router.post('/seed-github', async (req, res) => {
    try {
        const companies = ['Google', 'Amazon', 'Microsoft', 'Facebook', 'Apple', 'Uber', 'LinkedIn', 'Adobe']; // Facebook is Meta in some lists, check repo
        // GitHub Repo mapping: Facebook -> Facebook (in repo)

        let totalProcessed = 0;
        let totalNew = 0;
        let totalUpdated = 0;

        for (const company of companies) {
            console.log(`Fetching problems for ${company}...`);
            const url = `https://raw.githubusercontent.com/liquidslr/leetcode-company-wise-problems/main/${company}/5.%20All.csv`;

            try {
                const response = await axios.get(url);
                const csvData = response.data;
                const lines = csvData.split('\n');

                // Skip header: Difficulty,Title,Frequency,Acceptance Rate,Link,Topics
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;

                    const columns = parseCSVLine(line);
                    // Expected: [0]Diff, [1]Title, [2]Freq, [3]Rate, [4]Link, [5]Topics
                    if (columns.length < 5) continue;

                    const difficulty = columns[0];
                    const title = columns[1];
                    const link = columns[4];
                    const topicsRaw = columns[5] || "";

                    if (!title || !link) continue;

                    // Extract slug from link
                    // e.g., https://leetcode.com/problems/two-sum
                    const slugMatch = link.match(/\/problems\/([^/]+)/);
                    const slug = slugMatch ? slugMatch[1] : title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

                    // Check if problem exists
                    let problem = await Problem.findOne({
                        $or: [{ slug: slug }, { title: title }]
                    });

                    if (problem) {
                        // Update companies if not present
                        if (!problem.companies.includes(company)) {
                            problem.companies.push(company);
                            // Also merge tags if missing
                            const newTags = topicsRaw.split(';').map(t => t.trim()).filter(t => t);
                            for (const tag of newTags) {
                                if (!problem.tags.includes(tag)) {
                                    problem.tags.push(tag);
                                }
                            }
                            await problem.save();
                            totalUpdated++;
                        }
                    } else {
                        // Create new external problem
                        const tags = topicsRaw.split(';').map(t => t.trim()).filter(t => t);

                        const newProblem = new Problem({
                            title: title,
                            slug: slug,
                            description: `### External Problem\n\nThis is a [LeetCode problem](${link}).\n\n**Difficulty:** ${difficulty}\n**Company:** ${company}\n\nPlease click the link above to view the full problem description and submit your solution on LeetCode.`,
                            difficulty: difficulty === 'Easy' || difficulty === 'Medium' || difficulty === 'Hard' ? difficulty : 'Medium', // Fallback
                            tags: tags,
                            companies: [company],
                            inputFormat: "Refer to LeetCode link.",
                            outputFormat: "Refer to LeetCode link.",
                            constraints: "Refer to LeetCode link.",
                            examples: [],
                            testCases: [], // No local test cases for external problems
                            editorial: `No local editorial available. See [LeetCode Discuss](${link}/discuss).`
                        });
                        await newProblem.save();
                        totalNew++;
                    }
                    totalProcessed++;
                }
            } catch (companyErr) {
                console.error(`Failed to fetch/process for ${company}:`, (companyErr as Error).message);
                // Continue to next company
            }
        }

        res.json({
            msg: 'GitHub Seed Completed',
            stats: {
                processed: totalProcessed,
                new: totalNew,
                updated: totalUpdated
            }
        });

    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server error during GitHub seed');
    }
});

// Add Test Case (Admin/User contribution)
router.post('/:slug/testcase', async (req, res) => {
    try {
        const { input, output, explanation, isHidden } = req.body;
        const problem = await Problem.findOne({ slug: req.params.slug });

        if (!problem) return res.status(404).json({ msg: 'Problem not found' });

        if (isHidden) {
            // Add to hidden test cases (for Judge)
            problem.testCases.push({ input, output, isHidden: true });
        } else {
            // Add to visible examples (for Description)
            problem.examples.push({ input, output, explanation });
        }

        await problem.save();
        res.json(problem);
    } catch (err) {
        console.error((err as Error).message);
        res.status(500).send('Server error');
    }
});

export default router;
