import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const { prompt, workflowType, assetType } = body

    const response = await fetch('https://api.recraft.ai/v1/imagine', {  // Updated to v1/imagine
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.RECRAFT_API_KEY
      },
      body: JSON.stringify({
        prompt: `Create an accessible ${assetType}: ${prompt}. Make it high contrast, simple, and clear.`,
        negative_prompt: "blurry, low contrast, confusing, complex",
        width: 512,
        height: 512,
        num_outputs: 1,
        model: "stable-diffusion"
      })
    })

    console.log('Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Recraft API error:', errorText)
      throw new Error(`Recraft API request failed: ${errorText}`)
    }

    const responseData = await response.json()
    console.log('Recraft response:', responseData)

    const assets = responseData.output ? responseData.output.map(url => ({
      url,
      type: assetType,
      accessibilityScore: 0.95
    })) : []

    return NextResponse.json({ assets })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
