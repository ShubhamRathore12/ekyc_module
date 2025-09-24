import thumbnail1 from '@public/assets/tutorial/thumbnail1.png'
import thumbnail2 from '@public/assets/tutorial/thumbnail2.png'
import thumbnail3 from '@public/assets/tutorial/thumbnail3.png'
import thumbnail4 from '@public/assets/tutorial/thumbnail4.png'
import thumbnail5 from '@public/assets/tutorial/thumbnail5.png'
import thumbnail6 from '@public/assets/tutorial/thumbnail6.png'

export interface ContentItem {
    thumbnail: any,
    title : string
}
export const content: ContentItem[] = [
    {
        thumbnail : thumbnail1,
        title : 'SMC Ace Buy Sell Option'
    },
    {
        thumbnail : thumbnail2,
        title : 'Intro SMCAce MobileApp'
    },
    {
        thumbnail : thumbnail6,
        title : 'Ace Bracket Order'
    },
    {
        thumbnail : thumbnail3,
        title : 'Installation & Login Process'
    },
    {
        thumbnail : thumbnail4,
        title : 'SMC Ace Buy Sell Option'
    },
    {
        thumbnail : thumbnail5,
        title : 'ACE Bank Office Reports'
    }, 
    {
        thumbnail : thumbnail6,
        title : 'SMC Easy Go Pro'
    },
];

