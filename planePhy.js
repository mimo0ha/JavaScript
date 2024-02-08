//import vector from "./vector";

import { LoadingManager, Vector3 } from "three";
import { GUI } from 'dat.gui'
import * as dat from 'dat.gui'

export class Plane {
    static chamberPressure=7000000;
    constructor (
        position ,
        planeMass ,
        fuelMass ,
        massFlowRate ,
        exitVelocity ,
        temperature,
        theta,
        bita,
        alpha,
        dTime,
        angleWind,
        vilocityWind
        ) 
    {
        this.totalF = new Vector3(0,0,0);
        this.position =new Vector3(position.x,position.y, position.z );
        this.vilocity =new Vector3(0,0,0);
        this.acceleration=new Vector3(0,0,0);
        this.windDirection=new Vector3(0,0,0);
        this.planeMass = planeMass ;
        this.fuelMass = fuelMass ;
        this.massFlowRate = massFlowRate ;
        this.timeCorrection = 5 ;
        this.temperature = temperature;
        this.S=25;
        this.angleWind= angleWind;
        this.vilocityWind = vilocityWind;
        this.exitVelocity=exitVelocity;
        this.specificImpulse=10;
        this.planeAngle=0;
        this.raduis_nozzel = 0.1 ;
        this.alpha = alpha;
        this.RadAlpha = ((this.alpha * Math.PI) / 180);
        this.bita = bita;
        this.RadBita =  ((this.bita * Math.PI) / 180);
        this.theta = theta;
        this.RadTHETA = ((this.theta * Math.PI) / 180);
        this.dTime = dTime ;
        this.gravity = 0 ;
        this.g =new Vector3(0, 0,0);
        this.g2 =new Vector3(0, 0,0);
        this.l=new Vector3(0, 0,0);
        this.d=new Vector3(0, 0,0);
        this.t=new Vector3(0, 0,0);
        this.earthRaduis = 6356766;
        this.GravitationalConstant = 6.67428;
        this.earthMass = 5.972e13;
    }
    //الجاذبية
    gravity_force (){
        this.g =new Vector3(0 ,  -1 * (this.fuelMass+this.planeMass) * this.gravity , 0  );
    }    
    //رد الفعل
    gravity_force2(){
        this.g2 =new Vector3(0,(this.fuelMass+this.planeMass)* this.gravity , 0);
        }

    atm_pressure() {
             return 800 ; // Path : ./formulas/atm_pressure.png
    } 
    //كثافة الهواء 
    air_rho() { // ρ
    //  let rho = 1.204 ;
        let h = this.position.y;
        let rho0 = 1.225; // density at sea level in kg/m^3
        let T0 = 288.15; // temperature at sea level in K
        let R = 287.05; // gas constant for air in J/(kg*K)
        let g = 9.81; // acceleration due to gravity in m/s^2
        let L = 0.0065; // temperature lapse rate in K/m
        let T = T0 - L * h;
        let rho = rho0 * Math.pow(T / T0, (g / (R * L)) - 1) ;
        return rho * 500 ;
    }

    //معدل الحرق
    fuelRate(){
        //m_dot = rho * A * v
        let rho = this.air_rho();
        let area =  Math.PI * Math.pow(this.raduis_nozzel, this.raduis_nozzel);
         this.massFlowRate = rho * area *this.exitVelocity  ;
         return this.massFlowRate = 1 ;
    }

    enginOn(){
        if (this.exitVelocity!=0){
            return true ;
        }
        else
        return false ;
    }
    
        //الرياح
        wind(){
            this.windDirection = new Vector3(this.vilocityWind*Math.cos(this.angleWind),0,this.vilocityWind*Math.sin(this.angleWind)); 
            }    
    //السحب    
    drag(){
        let Cd = 0.5  //0.02 //drag coefficient at zero angle of attack
        let dz=  0.5 *  this.air_rho() *this.vilocity.length() * this.S * Cd;
        this.d =new Vector3( -1 * dz* Math.sin(this.alpha) , 0 , dz* Math.cos(this.alpha));
        
    }   

    //الرفع
    lift()
    {
        let Cl = 0.5  //0.02 //drag coefficient at zero angle of attack
        //var vilocitySquere = this.vilocity.length();
        let dl = this.air_rho() * this.vilocity.length() * this.S * Cl;
        this.l=new Vector3(0, dl*Math.sin(this.theta) , 0) 
    }

    //الدفع    
    Thrust() {
        if (this.noFuel()) {
            console.log("******welcom to syria, there is no fuel******");
        } 
        else { 
            if(this.enginOn()==true){
                let maxTHRUST = 50000;
                let thrust = 0.5 *  this.massFlowRate  *  this.dTime  * this.exitVelocity * 8 ;
                this.t = new Vector3(-1 * thrust * Math.sin(this.alpha),0, -1 * thrust * Math.cos(this.alpha) );
                console.log('eeeeeeeeeeee ' , this.exitVelocity);
          }
        }
     
    }

// حاجز اختراق الصوت 
    sound(){
        // machNumber = velocity / speedOfSound;
        let  speedOfSound = 343 ;
        let length = this.vilocity.lengthSq();
        let machNumber = length / speedOfSound ;
        if (machNumber > 1) {
         // Calculate the sonic boom
        let diameter = (1.2 * this.velocity) / speedOfSound ;
         return console.log('Sonic boom diameter meters' , diameter);
        } 
        else {
         return console.log("The plane is not traveling faster than the speed of sound.");
        } 
    }

    totalForces() {
        this.gravity_force();
        this.gravity_force2();
        this.Thrust();
        this.drag();
        this.lift();
        this.wind()
        
         this.totalF = this.totalF.add(this.g);
         console.log('gravity: ' , this.g);
         this.totalF = this.totalF.add(this.g2);
         console.log('gravity2: ' , this.g2);
         this.totalF = this.totalF.add(this.t);
         console.log('thrust: ' , this.t);
         this.totalF = this.totalF.add(this.d);
         console.log('drag: ' , this.d);
         this.totalF = this.totalF.add(this.l);
         console.log('lift: ' , this.l);
         this.totalF = this.totalF.add(this.windDirection);
        console.log('totalF: ' , this.totalF);
    }

    isFreeFall() {
        if(this.position.y > 60){
        let Distance = 0 ;
        let hight = this.position.y ;
        let time = 0 ;
        Distance += (this.gravity * this.dTime * this.dTime * 0.5 )  ; 
        //Update plane position 
        this.position.y = (hight - Distance)   ;
        time += 100 ;
        console.log('FREEEEEEEE FALLLLL');
        }
    }

    noFuel() {
        if(this.fuelMass == 0) {
        this.exitVelocity = 0;    
        this.t = new Vector3(0,0,0);
        return true;
        }
        else return false;
    }
    resetForces() {
        this.totalF =new Vector3(0, 0, 0);
    }
    gravity_acceleration(){
        let instantaneousHeight = this.position.y + this.earthRaduis;
        let d = instantaneousHeight * instantaneousHeight;
        this.gravity = (this.GravitationalConstant * this.earthMass) / d;
        //this.gravity =  9.81;
    }

    update(oldVilocity) {
        this.resetForces();
        this.gravity_acceleration();
        if(this.enginOn()){
            this.fuelRate() ;
            this.fuelMass = Math.max(this.fuelMass - this.massFlowRate , 0);
        }
        if (this.noFuel()==true) {
            this.massFlowRate = 0 ; 
            this.isFreeFall();
        }
        this.totalForces();
        console.log('FUEL ' + this.fuelMass);
        
        this.sound();

        if (this.noFuel()==true) {
            this.resetForces();
            this.isFreeFall();
            this.massFlowRate = 0 ;  
        }
        this.acceleration =new Vector3(
            (this.totalF.x  / (this.fuelMass + this.planeMass)) * (this.timeCorrection) ,
            (this.totalF.y  / (this.fuelMass + this.planeMass)) * (this.timeCorrection) ,
            (this.totalF.z  / (this.fuelMass + this.planeMass)) * (this.timeCorrection) ,
        );
        console.log('acceleraton:' , this.acceleration);
        this.vilocity =new Vector3(
             (oldVilocity.x)*Math.cos(this.theta)*Math.sin(this.theta)  + this.acceleration.x * this.dTime,
             (oldVilocity.y)*Math.sin(this.theta)                       + this.acceleration.y * this.dTime,
             (oldVilocity.z)*Math.cos(this.theta)*Math.sin(this.theta)  + this.acceleration.z * this.dTime
        );
        this.totalForces();
        console.log('vilocityyyy:' , this.vilocity);
        this.position.setX(this.position.x + this.vilocity.x * this.dTime);
        this.position.setY(this.position.y + this.vilocity.y * this.dTime);
        this.position.setZ(this.position.z + this.vilocity.z * this.dTime);
        console.log('****************************************************************************');
    }    
}
