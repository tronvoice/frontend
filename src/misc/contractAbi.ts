export default [
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_contractOwner",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "postId",
				"type": "uint256"
			}
		],
		"name": "deletePost",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "int256",
				"name": "offset",
				"type": "int256"
			}
		],
		"name": "get5PostIds",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "postIds",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "getAccountInfo",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "created",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "image",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "url",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "totalLikes",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "postsCount",
						"type": "uint256"
					}
				],
				"internalType": "struct TronVoice.AccountInfo",
				"name": "accountInfo",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "getLastestPost",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "text",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "date",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "likes",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "replyTo",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "replyCount",
						"type": "uint256"
					}
				],
				"internalType": "struct TronVoice.PostInfo",
				"name": "postInfo",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "postId",
				"type": "uint256"
			}
		],
		"name": "getPost",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "owner",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "text",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "date",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "likes",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "replyTo",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "replyCount",
						"type": "uint256"
					}
				],
				"internalType": "struct TronVoice.PostInfo",
				"name": "postInfo",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "postId",
				"type": "uint256"
			}
		],
		"name": "getReplies",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "replies",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "postId",
				"type": "uint256"
			}
		],
		"name": "like",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "text",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "replyTo",
				"type": "uint256"
			}
		],
		"name": "post",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "postsCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "image",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "url",
				"type": "string"
			}
		],
		"name": "setAccount",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_accountCreationCost",
				"type": "uint256"
			}
		],
		"name": "setAccountCost",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_likeCost",
				"type": "uint256"
			}
		],
		"name": "setLikeCost",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_postCost",
				"type": "uint256"
			}
		],
		"name": "setPostCost",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];