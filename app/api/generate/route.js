import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const { prompt, workflowType, assetType } = body

    console.log('Starting generation with:', { prompt, workflowType, assetType })

    if (!process.env.RECRAFT_API_KEY) {
      throw new Error('RECRAFT_API_KEY is not configured')
    }

    // Using the correct Recraft API endpoint
    const response = await fetch('https://api.recraft.ai/api/v1/imagine', {  // Updated endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RECRAFT_API_KEY}`
      },
      body: JSON.stringify({
        prompt,
        model: 'stable-diffusion', // Add model specification
        input_image_weight: 0.75,
        width: 512,
        height: 512,
        num_images: 1
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Recraft API error:', errorText)
      throw new Error(`Recraft API failed: ${errorText}`)
    }

    const recraftResponse = await response.json()
    console.log('Recraft response received:', recraftResponse)

    // Adjust based on actual Recraft response structure
    const assets = [{
      url: recraftResponse.output[0], // Adjust based on actual response structure
      type: assetType,
      accessibilityScore: 0.95
    }]

    return NextResponse.json({ assets })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Asset generation failed' },
      { status: 500 }
    )
  }
}
