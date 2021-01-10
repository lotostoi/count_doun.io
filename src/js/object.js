import lottie from 'lottie-web'

import { $, _await } from "@/js/functions"


class Obj {

    constructor({ container, animation, segment = [], daley = 0 }) {
        this.container = typeof container === 'object' ? container : $.el(container)

        this.segment = segment
        this.animation = animation

        this.obj = null
        this.daley = daley
        this.#createObject()
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
    }
}

export default Obj