const Coupon = require("../models/coupons");
const User_Log = require("../models/user_log");
const Coupon_Log = require("../models/coupon_log");

const { randomUUID } = require('crypto');





const validCoupon=function(coupon,date,res){
  const pdate=new Date(date);
  if(coupon.status!=='Active'){
    res.status(417).send('coupon is not active');
    return false;
  }
  else if(!pdate){
      res.status(417).send('date is out of range');
      return false;
    }
  else if(coupon.endDate<pdate || coupon.startDate>pdate){
      res.status(417).send('date is out of range');
      return false;
    }
  else if(coupon.limit<1 && coupon.limit!==null){
      coupon.status='In-Active';
      couponAdd({details:coupon});
      res.status(417).send('coupon limit is over');
      return false ;
    }
  else{
    return true;
  }
  
}






function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}




const checkCoupon=function(coupon,product,res){
  const today=new Date();
  const pdate=new Date(product.date);
  let cartDetails = {};
  let categoryApply=((coupon.category==='None')?coupon.Id:coupon.category)

  if(categoryApply!=='All'){
    product.products.forEach(function(d,index) {
      const search=getKeyByValue(d,categoryApply);
      if (cartDetails.hasOwnProperty(d[search])) {
        cartDetails[d[search]] = cartDetails[d[search]] + Number(Number(d.selling_price)*Number(product.quantity[index]));
      } else if(search) {
        cartDetails[d[search]] = Number(d.selling_price)*Number(product.quantity[index]);
      }
    });
}
else{
  categoryApply='undefined';
  product.products.forEach(function(d,index){
    const search='total';
      if (cartDetails.hasOwnProperty(d[search])) {
        cartDetails[d[search]] = cartDetails[d[search]] + Number(Number(d.selling_price)*Number(product.quantity[index]));
      } else if(search) {
        cartDetails[d[search]] = Number(d.selling_price)*Number(product.quantity[index]);
      }
  });
  // console.log('ALLrdftyui');
}

const uuid=randomUUID();


  if(coupon.type==='percentage'){
    const total=cartDetails[categoryApply];
    const discount=total*Number(coupon.value)/100;
    res.status(200).json({status:'Applied',discount:discount,uuid:uuid});
  }
  else if(coupon.type==='fixed amount'){
    if(cartDetails[categoryApply]<Number(coupon.value)){
      const discount=cartDetails[categoryApply];
      res.status(200).json({status:'Applied',discount:discount,uuid:uuid});
    }
    else{
      const discount=Number(coupon.value);
      res.status(200).json({status:'Applied',discount:discount,uuid:uuid});
    }
    
  }
  else{
    console.log('free shipping');
  }

  
        
    userlog(product.email,uuid,product.code);
    return;
      
}

 



const userlog=async(email,uuid,code)=>{
  
  console.log(email,uuid,code);
  const log = await User_Log.create({User_email:email,UUID:uuid,Coupon_Code:code});
  return;
}




const coupon=async function(toUpdate,res){
  console.log('sanchit',toUpdate);


    if(toUpdate != null && toUpdate.payload){
        const filter = { id: toUpdate.id };
        const updateDoc = {
            $set: toUpdate.payload,
          };
        const result = await Coupon.updateOne(filter, updateDoc);
    
    }

    else if(toUpdate != null && toUpdate.mode){
        const couponArr=[];
        for await (const doc of Coupon.findOne({_id:toUpdate.id})) {

            couponArr.push(doc);
            
        }
        res.json(couponArr);
        return;
        
    }

    else if(toUpdate != null && toUpdate.id){
        await Coupon.deleteOne({ _id: toUpdate.id })
        console.log('deleted');
    }
    const couponArr=[];
    for await (const doc of Coupon.find()) {

        couponArr.push(doc);
        
      }
    res.json(couponArr);

    return;

        
}





const couponAdd = async (toAdd, res) => {    

  
    try {
      const couponArr=[];
        for await (const doc of Coupon.findOne({code:toAdd.details.code})) {

            couponArr.push(doc);
            
        }
        if(couponArr.length!==0){
          const filter = { code: toAdd.details.code };
          const updateDoc = {
            $set: toAdd.details,
          };
          const result = await Coupon.updateOne(filter, updateDoc);
        }
        else{
          const coupon = await Coupon.create(toAdd.details);
          res.status(201).json({ coupon: coupon._id });
        }

    }
    catch(err) {
        console.log(err);
      res.status(400).json({ err });
    }
   
  }








  const couponDiscount = async (toFind, res) => {

    

  
    try {
      const couponArr=[];
        for await (const doc of Coupon.findOne({code:toFind.input})) {

            couponArr.push(doc);
            
        }
        
        if(couponArr.length!==0){
          res.status(201).json({couponArr});
        }
        else{
          const coupon = await Coupon.create(toAdd.details);
          res.status(201).json({ coupon: coupon._id });
        }

    }
    catch(err) {
        console.log(err);
      res.status(400).json({ err });
    }
   
  }






  const couponApplied = async (product,res)=>{

    try {
      const couponArr=[];
        for await (const doc of Coupon.findOne({code:product.code})) {

            couponArr.push(doc);
            
        }
        if(couponArr.length!==0){

          const valid=validCoupon(couponArr[0],product.date,res);
          if(valid){
            const check=checkCoupon(couponArr[0],product,res);
          }
          
        }
        else{
          res.status(404).send('coupon code not found');
        }

    }
    catch(err) {
      res.status(500).send(err)
    }

  }









  

  const couponDeduct = async (product,res)=>{
    // console.log(product);

    try {
      const log = await User_Log.findOne({User_email:product.email,UUID:product.uuid});
      if(log){
        const date=new Date();
        const coupon= await Coupon.findOne({code:product.coupon.code});
        const coupon_log = await Coupon_Log.create({User_email:product.email,Coupon_Code:product.coupon.code,Coupon_Value:product.coupon.value,Date:date});
        // console.log('coupon',coupon);
        if(coupon.limit){
          coupon.limit-=1;
          couponAdd({details:coupon});
        }
        
        // console.log('coupon',coupon_log);

        // couponAdd({details:coupon});
      }
      
      const del=await User_Log.deleteOne(log);
      // console.log(log);
      // res.status(201).json({address});

    }
    catch(err) {
      res.status(500).send(err)
    }

  }











module.exports.coupon_get = async (toUpdate, res) => {
    coupon(toUpdate,res);
}


module.exports.coupon_post = async (toUpdate, res) => {
  console.log(toUpdate,'coupon_post')
    coupon(toUpdate,res);
 
}



module.exports.coupon_add = async (toAdd, res) => {
    console.log(toAdd,'add')
    couponAdd(toAdd,res)
 
}


module.exports.coupon_applied = async (product, res) => {
  couponApplied(product,res)

}

module.exports.coupon_deduct = async (product, res) => {
  couponDeduct(product,res)

}


module.exports.coupon_disc = async (toFind, res) => {
  couponDiscount(toFind,res);

}

