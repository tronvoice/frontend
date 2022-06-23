
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.6;

import "./AddressSet.sol";

contract TronVoice {

    using AddressSet for AddressSet.Set;

    uint accountCreationCost = 100000000000000000;
    uint likeCost = 1;
    uint postCost = 1;
    
    mapping(address => Account) accounts;
    
    // Stored like this
    struct Account {
        address owner;
        uint created;
        string name;
        string image;
        string url;
        uint totalLikes;
        uint[] postIds;
        AddressSet.Set followers;
        AddressSet.Set following;
        uint earnedTrx; // TODO
    }
    
    Post[] posts;
    struct Post {
        address owner;
        string text;
        uint date;
        uint likes;

        uint replyTo;
        uint[] replies;
    }

    // API output
    struct AccountInfo {
        string name;
        uint created;
        string image;
        string url;
        uint totalLikes;
        uint postsCount;
        uint followersCount;
        uint followingCount;
    }

    struct PostInfo {
        address owner;
        string text;
        uint date;
        uint likes;

        uint replyTo;
        uint replyCount;
    }

    // --------------------------- view functions

    // TODO get last post id to show recent posts on the homepage

    function postsCount() public view returns (uint) {
        return posts.length;
    }

    function getAccountInfo(address owner) public view returns (AccountInfo memory accountInfo) {
        Account storage account = accounts[owner];
        accountInfo = AccountInfo(
            account.name,
            account.created,
            account.image,
            account.url,
            account.totalLikes,
            account.postIds.length,
            account.followers.count(),
            account.following.count()
        );
    }

    function getLastestPost(address owner) public view returns (PostInfo memory postInfo) {
        Account storage account = accounts[owner];
        uint lastPostId = account.postIds[account.postIds.length - 1];
        Post storage lastPost = posts[lastPostId];
        postInfo = PostInfo(
            lastPost.owner,
            lastPost.text,
            lastPost.date,
            lastPost.likes,
            lastPost.replyTo,
            lastPost.replies.length
        );
    }

    function get5PostIds(address owner, int offset) public view returns (uint[] memory postIds) {
        Account storage account = accounts[owner];
        int endElement = int(account.postIds.length) - offset;
        uint max = endElement >= 5 ? 5 : uint(endElement);
        uint start = uint(endElement) - max;

        postIds = new uint[](5);
        for (uint i = 0; i < max;) {
            postIds[i] = account.postIds[start + i];
            unchecked{ i++; }
        }
    }

    function getPost(uint postId) public view returns (PostInfo memory postInfo) {
        Post storage post1 = posts[postId];
        postInfo = PostInfo(
            post1.owner,
            post1.text,
            post1.date,
            post1.likes,
            post1.replyTo,
            post1.replies.length
        );
    }

    function getReplies(uint postId) public view returns (uint256[] memory replies) {
        require(postId != 0);
        Post storage post1 = posts[postId];
        replies = post1.replies;
    }

    // TODO implement replies to currently viewed post

    // --------------------------- non-view functions

    function setAccount(string memory name, string memory image, string memory url) public payable {
        Account storage account = accounts[msg.sender];
        if (account.created == 0) { // account creation
            // require(msg.value >= accountCreationCost);
            account.owner = msg.sender;
            account.created = block.timestamp;
        }
        account.name = name;
        account.image = image;
        account.url = url;
    }

    function follow(address adr) public {
        Account storage targetAccount = accounts[adr];
        Account storage thisAccount = accounts[adr];
        targetAccount.followers.insert(msg.sender);
        thisAccount.following.insert(adr);
    }

    function unfollow(address adr) public {
        Account storage targetAccount = accounts[adr];
        Account storage thisAccount = accounts[adr];
        targetAccount.followers.remove(msg.sender);
        thisAccount.following.remove(adr);
    }

    function post(string memory text, uint replyTo) public payable {
        // TODO payment
        uint postId = posts.length;
        uint[] memory replies;
        Post memory newPost = Post(msg.sender, text, block.timestamp, 0, replyTo, replies);
        posts.push(newPost);

        if (replyTo != 0) {
            Post storage repliedPost = posts[replyTo];
            repliedPost.replies.push(postId);
        }
        
        Account storage account = accounts[msg.sender];
        account.postIds.push(postId);
    }

    function deletePost(uint postId) public payable {
        // TODO
    }

    function like(uint postId) public payable {
        // TODO payment
        // TODO add payment to earned trx
        Post storage likedPost = posts[postId];
        likedPost.likes += 1;
        Account storage account = accounts[likedPost.owner];
        account.totalLikes += 1;
    }
    
}