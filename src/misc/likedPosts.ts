
let list: number[] = [];

const likedPosts = {
    init: () => {
        if (typeof window === 'undefined') {
            return;
        }
        const str = localStorage.getItem('likedPosts');
        list = str ? JSON.parse(str) : [];
    },
    isLiked: (postId: number) => {
        return list.includes(postId);
    },
    markAsLiked: (postId: number) => {
        list.push(postId);
        localStorage.setItem('likedPosts', JSON.stringify(list));
    }
};
likedPosts.init();

export default likedPosts;
