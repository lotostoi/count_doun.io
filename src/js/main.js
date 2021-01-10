import 'normalize.css'
import '@/scss/style.scss'

import { $ } from "@/js/functions"

import CountDown from "@/js/countdown"

import days from 'anim/days.json'
import hours from 'anim/hours.json'
import minutes from 'anim/minutes.json'
import seconds from 'anim/seconds.json'

const animations = {
  days, hours, minutes, seconds
}
const daleys = {
  days: 0, hours: 99, minutes: 233, seconds: 399
}
const segments = {
  days: [40, 140], hours: [40, 110], minutes: [40, 110], seconds: [40, 100]
}

new CountDown({ container: '.countdown', animations, daleys, segments })


