import { createClient } from '@insforge/sdk'

const baseUrl = 'https://ien975h3.us-east.insforge.app'
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMTg5NTd9.nCGIWhIEIM4p8VKfQPwY-QGCDmAnEzhzOountWC8b84'

export const insforgeClient = createClient({
  baseUrl,
  anonKey,
  persistSession: true,
  storage: localStorage
})
