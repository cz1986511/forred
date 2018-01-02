// 四则运算
function absoluteMul(num1,num2){   
	var m=0,s1=num1.toString(),s2=num2.toString();   
	try{m+=s1.split(".")[1].length}catch(e){}   
	try{m+=s2.split(".")[1].length}catch(e){}   
	return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m)   
}
function absoluteAdd(num1,num2){  
	var r1,r2,m;   
	try{r1=num1.toString().split(".")[1].length}catch(e){r1=0}   
	try{r2=num2.toString().split(".")[1].length}catch(e){r2=0}   
	m=Math.pow(10,Math.max(r1,r2))   
	return (num1*m+num2*m)/m   
}
function absoluteSub(num1,num2){   
	var r1,r2,m,n;  
	try{r1=num1.toString().split(".")[1].length}catch(e){r1=0}  
	try{r2=num2.toString().split(".")[1].length}catch(e){r2=0}  
	m=Math.pow(10,Math.max(r1,r2));  
	n=(r1>=r2)?r1:r2;  
	return parseFloat(((num1*m-num2*m)/m).toFixed(n));   
}
function absoluteDiv(num1,num2){
	var t1=0,t2=0,r1,r2;   
	try{t1=num1.toString().split(".")[1].length}catch(e){}   
	try{t2=num2.toString().split(".")[1].length}catch(e){}   
	with(Math){   
	  r1=Number(num1.toString().replace(".",""))   
	  r2=Number(num2.toString().replace(".",""))  
	  return absoluteMul((r1/r2),pow(10,t2-t1));   
	}   
}
// 获取url上的参数
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}