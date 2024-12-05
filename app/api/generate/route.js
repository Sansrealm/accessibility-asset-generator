import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const { prompt, workflowType, assetType } = body

    // Validate API key
    const apiKey = process.env.RECRAFT_API_KEY
    if (!apiKey) {
      throw new Error('Recraft API key is not configured')
    }

    // Using Bearer prefix with the API key
    const response = await fetch('https://api.recraft.ai/api/v1/imagine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`  // Added Bearer prefix back
      },
      body: JSON.stringify({
        prompt: `Create an accessible ${assetType}: ${prompt}`,
        width: 512,
        height: 512,
        num_images: 1,
        style: 'icon',
        negative_prompt: "blurry, low contrast, confusing, complex"
      })
    })

    // Log the response for debugging
    console.log('Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Recraft API error:', errorText)
      throw new Error(`Recraft API request failed: ${errorText}`)
    }

    const responseData = await response.json()
    console.log('Recraft response:', responseData)

    const assets = Array.isArray(responseData.output) ? responseData.output.map(url => ({
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
