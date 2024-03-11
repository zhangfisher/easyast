
()=>{}


let v0
const v1 = require('./a');
const v2 = 1
const v3 = 2

let vx = 1,vy=2,vz=3;
1+1
1+2*2+v2+v3*vy
const t1=`i am template literal ${v1}  ${v2}`
const t2=String.raw`i am string.raw literal ${v1}  ${v2}`

function a(){
    console.log('I am a');
    return 1;
}

const f1= ()=>{console.log('I am f1');return 1;}
const f2= async ()=>{console.log('I am f2');return 2;}
const f3= function(){console.log('I am f1');return 1;}

async function b(){
    console.log('I am b');
    return {x:1,y:2};
}

async function c(x,y=2,z=a(),m=[],n= 1 & 2  & 3,...rest){
    console.log('I am c');
    return [1,2,3];
}

async function d(x,y,...z){
    console.log('I am d');
    let a=1
    return a;
}

function* e(x,y,z){
    console.log('I am e');
    let a=1,b
    return a+b;
}

function f(x,y,...z){
    console.log('I am f'); 
}

function g(x,
    y,
    ...z
){
    console.log('I am g');
    return v1+v2;
}




class A{
    constructor(){
        console.log('I am A');
    }
}

class B extends A{
    constructor(){
        super();
        console.log('I am B');
    }
}

class C extends B{
    static a='a'
    static b='b'
    x=1
    y=2    
    constructor(){
        super();
        console.log('I am C');
    }
    print(a,b){
        console.log('I am print');
    }
    getId(c){
        console.log('I am getId');
        return '1'
    }
    *log(text,...values){

    }
    print =()=>{}

}


const factory = ()=>{

}
class D extends factory(){
    constructor(){
        super();
        console.log('I am D');
    }
}