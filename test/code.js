
()=>{}



const v1 = require('./a');
const v2 = 1
const v3 = 2
let vx = 1,vy=2,vz=3;
1+1
1+2*2+v2+v3*vy

function a(){
    console.log('I am a');
    return 1;
}

const f1= ()=>{console.log('I am f1');return 1;}
const f2= async ()=>{console.log('I am f2');return 2;}

async function b(){
    console.log('I am b');
    return 2;
}

async function c(x,y=2,z=a(),m=[],n= 1 & 2  & 3,...rest){
    console.log('I am c');
    return 3;
}

async function d(x,y,...z){
    console.log('I am d');
    return 4;
}

function* e(x,y,z){
    console.log('I am e');
    return 5;
}

function f(x,y,...z){
    console.log('I am f');
    return 6;
}