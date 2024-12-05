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

    // Call Recraft API with proper bearer token
    const response = await fetch('https://api.recraft.ai/api/v1/imagine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`  // Added Bearer prefix properly
      },
      body: JSON.stringify({
        prompt: `Create an accessible ${assetType}: ${prompt}`,
        width: 512,
        height: 512,
        num_images: 1,
        style: 'icon'  // Added style parameter for icons
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Recraft API error:', errorText)
      try {
        const errorJson = JSON.parse(errorText)
        throw new Error(errorJson.error || 'Recraft API request failed')
      } catch {
        throw new Error(`Recraft API request failed: ${errorText}`)
      }
    }

    const responseData = await response.json()
    console.log('Recraft API response:', responseData)

    // Handle the response data
    const assets = (responseData.output || []).map(url => ({
      url,
      type: assetType,
      accessibilityScore: 0.95
    }))

    return NextResponse.json({ assets })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
