import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const { prompt, workflowType, assetType } = body

    const response = await fetch('https://api.recraft.ai/v2/generations', {  // Changed to v2 endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.RECRAFT_API_KEY  // Changed to x-api-key header
      },
      body: JSON.stringify({
        prompt: `Create an accessible ${assetType}: ${prompt}. Make it high contrast, simple, and clear.`,
        negative_prompt: "blurry, low contrast, confusing, complex",
        model: "sd-2.1",  // Added model parameter
        width: 512,
        height: 512,
        num_outputs: 1
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

    // Adjust based on actual response structure
    const assets = responseData.images ? responseData.images.map(image => ({
      url: image.url,
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
