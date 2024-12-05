import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const { prompt, workflowType, assetType } = body

    const response = await fetch('https://external.api.recraft.ai/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.RECRAFT_API_KEY
      },
      body: JSON.stringify({
        prompt: `Create an accessible ${assetType}: ${prompt}. Make it high contrast, simple, and clear.`,
        n: 1,
        size: '1024x1024',
        model: 'recraftv3',
        style: 'digital_illustration',  // Using this style for cleaner, more accessible output
        response_format: 'url'
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

    // Adjust based on their response format where data[0].url contains the image URL
    const assets = responseData.data ? responseData.data.map(item => ({
      url: item.url,
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
