
//% color="#00A074" weight=88 icon="\uf021"  block="서보모터"

namespace cck {
    //% fixedInstances
    export class Servo {
        private _minAngle: number;
        private _maxAngle: number;
        private _stopOnNeutral: boolean;

        constructor() {
            this._minAngle = 0;
            this._maxAngle = 180;
            this._stopOnNeutral = true;
        }

        private clampDegrees(degrees: number): number {
            degrees = degrees | 0;
            degrees = Math.clamp(this._minAngle, this._maxAngle, degrees);
            return degrees;
        }

        /**
         * Set the servo angle
         */
        //% weight=100 help=servos/set-angle
        //% block="서보모터 %servo 각도를 %degrees=protractorPicker °"
        //% degrees.defl=90
        //% servo.fieldEditor="gridpicker"
        //% servo.fieldOptions.width=220
        //% servo.fieldOptions.columns=2
        //% parts=microservo trackArgs=0
        setAngle(degrees: number) {
            degrees = this.clampDegrees(degrees);
            this.internalSetAngle(degrees);
        }

        protected internalSetAngle(angle: number): void {

        }

        /**
         * Set the throttle on a continuous servo
         * @param speed the throttle of the motor from -100% to 100%
         */
        //% weight=99 help=servos/run
        //% blockId=servoservorun block="연속모터 %servo 속도를 %speed=speedPicker \\%"
        //% servo.fieldEditor="gridpicker"
        //% servo.fieldOptions.width=220
        //% servo.fieldOptions.columns=2
        //% parts=microservo trackArgs=0
        run(speed: number): void {
            const degrees = this.clampDegrees(Math.map(speed, -100, 100, this._minAngle, this._maxAngle));
            const neutral = (this.maxAngle - this.minAngle) >> 1;
            if (this._stopOnNeutral && degrees == neutral)
                this.stop();
            else
                this.setAngle(degrees);
        }

        //% weight=98 help=servos/run_for
        //% blockId=servoservorunf bblock="연속모터 %servo 반시계방향 돌리기"
        //% parts=microservo trackArgs=0
        run_for(speed: number): void {
            this.setAngle(this._maxAngle);
        }

        //% weight=97 help=servos/run_back
        //% blockId=servoservorunb bblock="연속모터 %servo 시계방향 돌리기"
        //% parts=microservo trackArgs=0
        run_back(speed: number): void {
            this.setAngle(this._minAngle);
        }

        /**
         * Stop sending commands to the servo so that its rotation will stop at the current position.
         */
        // On a normal servo this will stop the servo where it is, rather than return it to neutral position.
        // It will also not provide any holding force.
        //%  help=servos/stop
        //% blockId=servoservostop block="모터정지 %servo"
        //% servo.fieldEditor="gridpicker"
        //% servo.fieldOptions.width=220
        //% servo.fieldOptions.columns=2
        //% parts=microservo trackArgs=0
        stop() {
            this.internalStop();
        }

        /**
         * Gets the minimum angle for the servo
         */
        public get minAngle() {
            return this._minAngle;
        }

        /**
         * Gets the maximum angle for the servo
         */
        public get maxAngle() {
            return this._maxAngle;
        }

        protected internalStop() { }
    }

    export class PinServo extends Servo {
        private _pin: MicrobitPin;

        constructor(pin: MicrobitPin) {
            super();
            this._pin = pin;
        }

        protected internalSetAngle(angle: number): void {
            this._pin.servoWrite(angle);
        }

        protected internalStop() {
            this._pin.digitalWrite(false);
        }
    }

    //% block="P1" fixedInstance whenUsed
    export const P1 = new cck.PinServo(new MicrobitPin(DigitalPin.P1));
    //% block="P2" fixedInstance whenUsed
    export const P2 = new cck.PinServo(new MicrobitPin(DigitalPin.P2));
    //% block="P13" fixedInstance whenUsed
    export const P13 = new cck.PinServo(new MicrobitPin(DigitalPin.P13));
    //% block="P14" fixedInstance whenUsed
    export const P14 = new cck.PinServo(new MicrobitPin(DigitalPin.P14));

    //% blockId=secPicker block="$score"
    //% blockHidden=true
    //% colorSecondary="#FFFFFF"
    //% score.fieldEditor="numberdropdown" score.fieldOptions.decompileLiterals=true
    //% score.fieldOptions.data='[0.1, 0.2, 0.3, 0.4, 0.5, 1, 2, 3, 4, 5]'
    export function __tennisScore(score: number): number {
        return score;
    }
    //% color="#0090BB"
    //% block="잠시쉬기 %time 초"
    //% time.min=0 time.defl=1
    //% time.shadow="secPicker"
    export function pause(time: number): void {
        basic.pause(time * 1000);
    }
}
