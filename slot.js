/**
* Slot machine
* Author: Saurabh Odhyan | http://odhyan.com
*
* Licensed under the Creative Commons Attribution-ShareAlike License, Version 3.0 (the "License")
* You may obtain a copy of the License at
* http://creativecommons.org/licenses/by-sa/3.0/
*
* Date: May 23, 2011 
*/


$(document).ready(function() {
    /**
    * Global variables
    */
    var completed = 0,
        imgHeight = 4800,
        posArr = [
            75, //image1
            375, //image2 
            675, //image3
            975, //guava
            1275, //banana
            1575, //cherry
            1875, //orange
            2175, //number 7
            2475, //bar
            2775, //guava
            3075, //banana
            3375, //cherry
            3675, //orange
            3975, //number 7
            4275, //bar
            4575, //guava
            4875, //banana
            5175 //cherry
        ];
    
    var myVideo = document.getElementById("playvid");
    
    var win = [];
    win[75]   = win[1875] = win[3675] = 1;
    win[375]  = win[2175] = win[3975] = 2;
    win[675]  = win[2475] = win[4275] = 3;
    win[975]  = win[2775] = win[4575] = 4;
    win[1275] = win[3075] = win[4875] = 5;
    win[1575] = win[3375] = win[5175] = 6;
    
    /**
    * @class Slot
    * @constructor
    */
    function Slot(el, max, step) {
        this.speed = 0; //speed of the slot at any point of time
        this.step = step; //speed will increase at this rate
        this.si = null; //holds setInterval object for the given slot
        this.el = el; //dom element of the slot
        this.maxSpeed = max; //max speed this slot can have
        this.pos = null; //final position of the slot    

        $(el).pan({
            fps:25,
            dir:'down'
        });
        $(el).spStop();
    }

    /**
    * @method start
    * Starts a slot
    */
    Slot.prototype.start = function() {
        var _this = this;
        $(_this.el).addClass('motion');
        $(_this.el).spStart();
        _this.si = window.setInterval(function() {
            if(_this.speed < _this.maxSpeed) {
                _this.speed += _this.step;
                $(_this.el).spSpeed(_this.speed);
            }
        }, 100);
    };

    /**
    * @method stop
    * Stops a slot
    */
    Slot.prototype.stop = function() {
        var _this = this,
            limit = 30;
        clearInterval(_this.si);
        _this.si = window.setInterval(function() {
            if(_this.speed > limit) {
                _this.speed -= _this.step;
                $(_this.el).spSpeed(_this.speed);
            }
            if(_this.speed <= limit) {
                _this.finalPos(_this.el);
                $(_this.el).spSpeed(0);
                $(_this.el).spStop();
                clearInterval(_this.si);
                $(_this.el).removeClass('motion');
                _this.speed = 0;
            }
        }, 100);
    };

    /**
    * @method finalPos
    * Finds the final position of the slot
    */
    Slot.prototype.finalPos = function() {
        var el = this.el,
            el_id,
            pos,
            posMin = 2000000000,
            best,
            bgPos,
            i,
            j,
            k;

        el_id = $(el).attr('id');
        //pos = $(el).css('background-position'); //for some unknown reason, this does not work in IE
        pos = document.getElementById(el_id).style.backgroundPosition;
        pos = pos.split(' ')[1];
        pos = parseInt(pos, 10);

        for(i = 0; i < posArr.length; i++) {
            for(j = 0;;j++) {
                k = posArr[i] + (imgHeight * j);
                if(k > pos) {
                    if((k - pos) < posMin) {
                        posMin = k - pos;
                        best = k;
                        this.pos = posArr[i]; //update the final position of the slot
                    }
                    break;
                }
            }
        }

        best += imgHeight + 4;
        bgPos = "0 " + best + "px";
        $(el).animate({
            backgroundPosition:"(" + bgPos + ")"
        }, {
            duration: 200,
            complete: function() {
                completed ++;
            }
        });
    };  

    /**
    * @method reset
    * Reset a slot to initial state
    */
    Slot.prototype.reset = function() {
        var el_id = $(this.el).attr('id');
        $._spritely.instances[el_id].t = 0;
        $(this.el).css('background-position', '0px 75px');
        this.speed = 0;
        completed = 0;
        $('#result').html('');
    };

    function enableControl() {
        $('#control').attr("disabled", false);
    }

    function disableControl() {
        $('#control').attr("disabled", true);
    }

    function enableCheck() {
        $('#check').attr("disabled", false);
    }

    function disableCheck() {
        $('#check').attr("disabled", true);
    }
    
    function printResult() {
        var res;
        if(win[a.pos] === win[b.pos] && win[a.pos] === win[c.pos]) {
            res = "";
        } else {
            res = "";
        }
        $('#result').html(res);
    }

    //create slot objects
    var a = new Slot('#slot1', 30, 1),
        b = new Slot('#slot2', 45, 2),
        c = new Slot('#slot3', 70, 3);

    /**
    * Slot machine controller
    */
    $('#control').click(function() {
        var x;
        if(this.innerHTML == "Start") {
            a.start();
            b.start();
            c.start();
            this.innerHTML = "Stop";
            
            disableControl(); //disable control until the slots reach max speed
            
            //check every 100ms if slots have reached max speed 
            //if so, enable the control
            x = window.setInterval(function() {
                if(a.speed >= a.maxSpeed && b.speed >= b.maxSpeed && c.speed >= c.maxSpeed) {
                    enableControl();
                    window.clearInterval(x);
                }
            }, 100);
        } else if(this.innerHTML == "Stop") {
            a.stop();
            b.stop();
            c.stop();
            this.innerHTML = "Reset";

            disableControl(); //disable control until the slots stop

            //check every 100ms if slots have stopped
            //if so, enable the control
            x = window.setInterval(function() {
                if(a.speed === 0 && b.speed === 0 && c.speed === 0 && completed === 3) {
                    enableControl();
                    window.clearInterval(x);
                    printResult();
                }
            }, 100);
        } else { //reset
            a.reset();
            b.reset();
            c.reset();
            this.innerHTML = "Start";
        }
    });

    //create slot objects
    var d = new Slot('#slot4', 85, 4);

    /**
    * Slot machine controller
    */
    $('#check').click(function() {
        var x;



        if(this.innerHTML == "Start") {
            d.start();
            this.innerHTML = "Stop";
            
            disableCheck(); //disable control until the slots reach max speed
            
            //check every 100ms if slots have reached max speed 
            //if so, enable the control
            x = window.setInterval(function() {
                if(d.speed >= d.maxSpeed) {
                    enableCheck();
                    window.clearInterval(x);
                }
            }, 100);
        } else if(this.innerHTML == "Stop") {
            d.stop();
            this.innerHTML = "Reset";

            disableCheck(); //disable control until the slots stop

            //check every 100ms if slots have stopped
            //if so, enable the control
            x = window.setInterval(function() {
                if(d.speed === 0) {
                    enableCheck();
                    window.clearInterval(x);
                    printResult();
                }
            }, 100);
            // Now trigger video playback to explain result of spins
            myVideo.src('clipxx.mp4');
            myVideo.play();
        } else { //reset
            d.reset();
            this.innerHTML = "Start";
        }
    });
});
