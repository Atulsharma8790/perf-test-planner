import { NextResponse } from 'next/server'
export function verifyPasscode(req: Request) { return (req.headers.get('x-access-code') ?? '') === process.env.ACCESS_PASSCODE }
export function unauthorizedResponse() { return NextResponse.json({ error: 'Invalid passcode' }, { status: 401 }) }
