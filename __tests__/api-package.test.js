/* eslint-disable babel/new-cap */
/**
 * @vitest-environment node
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextResponse } from 'next/server'
import { POST } from '~/app/api/package/route'
import query from '~/libs/query'

describe('API Route - POST', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('debería crear un nuevo paquete y retornar status 201', async () => {
    const inputData = {
      'name': 'Name',
      'description': 'description',
      'images': [
        '1.jpg',
        '2.jpg'
      ],
      'videos': [
        '1.mp4',
        '1.mp4'
      ],
      'limit': 50,
      'subjects': [
        {
          'name': '1',
          'description': '1.'
        },
        {
          'name': '2',
          'description': '2'
        },
        {
          'name': '3',
          'description': '3'
        }
      ]
    }

    const expectedResponse = {
      'id': 1,
      'name': 'Name',
      'description': 'description',
      'images': [
        '1.jpg',
        '2.jpg'
      ],
      'videos': [
        '1.mp4',
        '2.mp4'
      ],
      'limit': 50,
      'subjects': [
        1,
        2,
        3
      ]
    }

    query.mockResolvedValue(expectedResponse)

    const mockRequest = {
      json: vi.fn().mockResolvedValue(inputData),
    }

    await POST(mockRequest)

    expect(query).toHaveBeenCalledWith({
      entity: 'package',
      queryType: 'create',
      includes: ['subjects'],
      data: {
        name: inputData.name,
        description: inputData.description,
        images: inputData.images,
        videos: inputData.videos,
        limit: inputData.limit,
      },
      relations: [{
        entity: 'subjects',
        data: inputData.subjects
      }],
    })

    expect(NextResponse.json).toHaveBeenCalledWith(expectedResponse, { status: 201 })
  })

  it('debería retornar status 400 si faltan campos requeridos', async () => {
    const invalidData = {
      'description': 'description',
      'images': [
        '1.jpg',
        '2.jpg'
      ],
      'videos': [
        '1.mp4',
        '1.mp4'
      ],
      'limit': 50,
      'subjects': [
        {
          'name': '1',
          'description': '1.'
        },
        {
          'name': '2',
          'description': '2'
        },
        {
          'name': '3',
          'description': '3'
        }
      ]
    }

    const mockRequest = {
      json: vi.fn().mockResolvedValue(invalidData),
    }

    await POST(mockRequest)

    expect(query).not.toHaveBeenCalled()

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Invalid input' },
      { status: 400 }
    )
  })

  it('debería manejar errores y retornar status 500', async () => {
    const inputData = {
      'name': 'Name',
      'description': 'description',
      'images': [
        '1.jpg',
        '2.jpg'
      ],
      'videos': [
        '1.mp4',
        '1.mp4'
      ],
      'limit': 50,
      'subjects': [
        {
          'name': '1',
          'description': '1.'
        },
        {
          'name': '2',
          'description': '2'
        },
        {
          'name': '3',
          'description': '3'
        }
      ]
    }

    query.mockRejectedValue(new Error('Database error'))

    const mockRequest = {
      json: vi.fn().mockResolvedValue(inputData),
    }

    await POST(mockRequest)

    expect(NextResponse.json).toHaveBeenCalledWith(
      { error: 'Package creation failed' },
      { status: 500 }
    )
  })
})
