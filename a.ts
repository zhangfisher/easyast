import { FlexIterator } from './src/utils';

// Example usage:  
const numbers = [1, 2, [3, 4], 5, [6, [7, 8]]];  
  
const flexIterator = new FlexIterator<number,number,number[]>(numbers, {  
    transform: (item) => item * 2 ,
    recursion:true 
});  
  
for (const value of flexIterator) {  
    console.log(value); // Prints: 2, 4, 6, 8, 10, 12, 14, 16  
}

console.log("-----------")

for (const value of flexIterator) {  
    console.log(value); // Prints: 2, 4, 6, 8, 10, 12, 14, 16  
}

 const source = new FlexIterator<number,string,number[]>([1,2,[3,4],[5,6,[7,8,[9,10]]]],{
    pick:(item)=>{
        return item
    },
    transform:(value,parent)=>{ 
        return `S-${value}${parent ? `(parent=${String(parent)}` : ''}}`
    },
        recursion:true
    })
 for(let value of source){
  console.log(value)  
 }

 