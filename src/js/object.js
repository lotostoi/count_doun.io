import lottie from 'lottie-web'

import { $, _await } from "@/js/functions"

class Obj {

    static startValue = null


    constructor({ container, animation, segment = [], daley = 0, type = "seconds", value = ".value", config }) {
        this.container = typeof container === 'object' ? container : $.el(container)
        this.value = typeof value === 'object' ? value : $.el(value, this.container)
        this.segment = segment
        this.animation = animation
        this.type = type
        this.config = config
        this.obj = null
        this.daley = daley
        this.#createObject()

    }

    get period() {
        return this._period
    }
    set period(period) {
        this._period = period
        const key = Object.keys(period).find(key => key.includes(this.type))
        let value = period[key]
        this.value.innerHTML = value
        return true
    }

    async setValues() {

        if (!Obj.startValue) {
            Obj.startValue = this.getDate()
        }

        Obj.startValue = await Obj.startValue
        const period = Obj.startValue


        setInterval(() => {
            const time = period.getTime() - (new Date().getTime())
            this.period = this.calcStartValue(time)
        }, 1000)


    }

    async getDate() {
        const { year, month, day, hours, minutes, seconds } = await this.#getJson()
        const date = new Date(year, month, day, hours, minutes, seconds)
        return date
       /*  const time = date.getTime() - (new Date().getTime())
        return this.calcStartValue(time) */
    }

    async #getJson() {
        const response = await fetch('./src/assets/config/date.json')
        let res = await response.json()
        return res
    }

    calcStartValue(value) {

        return {
            days: Math.floor(value / (24 * 60 * 60 * 1000)),
            hours: Math.floor(value / (60 * 60 * 1000)) % 24,
            minutes: Math.floor(value / (60 * 1000)) % 60,
            seconds: Math.floor(value / 1000) % 60,
        }

    }

    async #createObject() {
       
        let { container, obj, animation, daley, segment } = this
        if (daley) {
            await _await(daley)
        }
        obj = lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: animation,
        })
        if (segment.length) {
            obj.addEventListener('enterFrame', function () {
                obj.playSegments(segment, false)
            })
        }
        await this.setValues()
    }
}

export default Obj