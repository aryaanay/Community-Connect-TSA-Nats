import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { amount, causeId, causeName } = await req.json()

    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // cents
      currency: 'usd',
      metadata: { causeId, causeName },
      automatic_payment_methods: { enabled: true },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
