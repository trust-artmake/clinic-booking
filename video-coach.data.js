// 匿名の模擬データと索引だけを同梱。ネットワーク取得なし。
window.VIDEO_COACH_DATA={
  "fixtures": {
    "full": {
      "member": {
        "member_id": "member-demo",
        "artist_id": "artist-demo",
        "display_name": "デモ担当",
        "store_label": "サンプル店",
        "region_label": "地域"
      },
      "inputs": {
        "worries": [
          {
            "key": "asymmetry",
            "primary": true
          }
        ],
        "visibility": "customer_face_ok",
        "region_label": "地域",
        "member_id": "member-demo",
        "artist_id": "artist-demo"
      },
      "analyses": [
        {
          "clip_id": "clip-01",
          "original_name": "clip-01.mp4",
          "duration": 18,
          "width": 720,
          "height": 1280,
          "status": "analyzed",
          "sha256": "1111111111111111111111111111111111111111111111111111111111111111",
          "segments": [
            {
              "id": "seg-01",
              "start": 1,
              "end": 15,
              "shot_type": "staff_intro",
              "who_visible": "staff_only",
              "camera": {
                "stable": true,
                "dark": false,
                "blurry": false
              },
              "speech": [
                {
                  "start": 2,
                  "end": 5,
                  "speaker": "staff",
                  "text": "左右のバランスを鏡で確認します",
                  "confidence": 0.9
                },
                {
                  "start": 6,
                  "end": 9,
                  "speaker": "staff",
                  "text": "形を相談しながら決めていきます",
                  "confidence": 0.9
                }
              ],
              "retake_of": null,
              "notes": "匿名の模擬素材。実際の映像の解析ではありません。"
            }
          ],
          "clip_flags": {
            "silent": false,
            "multiple_customers_suspected": false,
            "text_burned_in": false
          },
          "worry_candidates": [
            {
              "key": "asymmetry",
              "evidence": "模擬音声の設定"
            }
          ],
          "model": "mock-no-api",
          "usage": {
            "input_tokens": 0,
            "output_tokens": 0
          }
        },
        {
          "clip_id": "clip-02",
          "original_name": "clip-02.mp4",
          "duration": 18,
          "width": 720,
          "height": 1280,
          "status": "analyzed",
          "sha256": "2222222222222222222222222222222222222222222222222222222222222222",
          "segments": [
            {
              "id": "seg-02",
              "start": 1,
              "end": 15,
              "shot_type": "face_front",
              "who_visible": "customer_face",
              "camera": {
                "stable": true,
                "dark": false,
                "blurry": false
              },
              "speech": [],
              "retake_of": null,
              "notes": "匿名の模擬素材。実際の映像の解析ではありません。"
            }
          ],
          "clip_flags": {
            "silent": true,
            "multiple_customers_suspected": false,
            "text_burned_in": false
          },
          "worry_candidates": [
            {
              "key": "asymmetry",
              "evidence": "模擬音声の設定"
            }
          ],
          "model": "mock-no-api",
          "usage": {
            "input_tokens": 0,
            "output_tokens": 0
          }
        },
        {
          "clip_id": "clip-03",
          "original_name": "clip-03.mp4",
          "duration": 18,
          "width": 720,
          "height": 1280,
          "status": "analyzed",
          "sha256": "3333333333333333333333333333333333333333333333333333333333333333",
          "segments": [
            {
              "id": "seg-03",
              "start": 1,
              "end": 15,
              "shot_type": "brow_close",
              "who_visible": "customer_partial",
              "camera": {
                "stable": true,
                "dark": false,
                "blurry": false
              },
              "speech": [],
              "retake_of": null,
              "notes": "匿名の模擬素材。実際の映像の解析ではありません。"
            }
          ],
          "clip_flags": {
            "silent": true,
            "multiple_customers_suspected": false,
            "text_burned_in": false
          },
          "worry_candidates": [
            {
              "key": "asymmetry",
              "evidence": "模擬音声の設定"
            }
          ],
          "model": "mock-no-api",
          "usage": {
            "input_tokens": 0,
            "output_tokens": 0
          }
        },
        {
          "clip_id": "clip-04",
          "original_name": "clip-04.mp4",
          "duration": 18,
          "width": 720,
          "height": 1280,
          "status": "analyzed",
          "sha256": "4444444444444444444444444444444444444444444444444444444444444444",
          "segments": [
            {
              "id": "seg-04",
              "start": 1,
              "end": 15,
              "shot_type": "consult_mid",
              "who_visible": "customer_partial",
              "camera": {
                "stable": true,
                "dark": false,
                "blurry": false
              },
              "speech": [
                {
                  "start": 2,
                  "end": 5,
                  "speaker": "customer",
                  "text": "気に入りました",
                  "confidence": 0.9
                },
                {
                  "start": 6,
                  "end": 9,
                  "speaker": "staff",
                  "text": "形を相談しながら決めていきます",
                  "confidence": 0.9
                }
              ],
              "retake_of": null,
              "notes": "匿名の模擬素材。実際の映像の解析ではありません。"
            }
          ],
          "clip_flags": {
            "silent": false,
            "multiple_customers_suspected": false,
            "text_burned_in": false
          },
          "worry_candidates": [
            {
              "key": "asymmetry",
              "evidence": "模擬音声の設定"
            }
          ],
          "model": "mock-no-api",
          "usage": {
            "input_tokens": 0,
            "output_tokens": 0
          }
        },
        {
          "clip_id": "clip-05",
          "original_name": "clip-05.mp4",
          "duration": 18,
          "width": 720,
          "height": 1280,
          "status": "analyzed",
          "sha256": "5555555555555555555555555555555555555555555555555555555555555555",
          "segments": [
            {
              "id": "seg-05",
              "start": 1,
              "end": 15,
              "shot_type": "design_hands",
              "who_visible": "customer_partial",
              "camera": {
                "stable": true,
                "dark": false,
                "blurry": false
              },
              "speech": [],
              "retake_of": null,
              "notes": "匿名の模擬素材。実際の映像の解析ではありません。"
            }
          ],
          "clip_flags": {
            "silent": true,
            "multiple_customers_suspected": false,
            "text_burned_in": false
          },
          "worry_candidates": [
            {
              "key": "asymmetry",
              "evidence": "模擬音声の設定"
            }
          ],
          "model": "mock-no-api",
          "usage": {
            "input_tokens": 0,
            "output_tokens": 0
          }
        },
        {
          "clip_id": "clip-06",
          "original_name": "clip-06.mp4",
          "duration": 18,
          "width": 720,
          "height": 1280,
          "status": "analyzed",
          "sha256": "6666666666666666666666666666666666666666666666666666666666666666",
          "segments": [
            {
              "id": "seg-06",
              "start": 1,
              "end": 15,
              "shot_type": "procedure_wide",
              "who_visible": "customer_partial",
              "camera": {
                "stable": true,
                "dark": false,
                "blurry": false
              },
              "speech": [],
              "retake_of": null,
              "notes": "匿名の模擬素材。実際の映像の解析ではありません。"
            }
          ],
          "clip_flags": {
            "silent": true,
            "multiple_customers_suspected": false,
            "text_burned_in": false
          },
          "worry_candidates": [
            {
              "key": "asymmetry",
              "evidence": "模擬音声の設定"
            }
          ],
          "model": "mock-no-api",
          "usage": {
            "input_tokens": 0,
            "output_tokens": 0
          }
        },
        {
          "clip_id": "clip-07",
          "original_name": "clip-07.mp4",
          "duration": 18,
          "width": 720,
          "height": 1280,
          "status": "analyzed",
          "sha256": "7777777777777777777777777777777777777777777777777777777777777777",
          "segments": [
            {
              "id": "seg-07",
              "start": 1,
              "end": 15,
              "shot_type": "tool_prop",
              "who_visible": "none",
              "camera": {
                "stable": true,
                "dark": false,
                "blurry": false
              },
              "speech": [],
              "retake_of": null,
              "notes": "匿名の模擬素材。実際の映像の解析ではありません。"
            }
          ],
          "clip_flags": {
            "silent": true,
            "multiple_customers_suspected": false,
            "text_burned_in": false
          },
          "worry_candidates": [
            {
              "key": "asymmetry",
              "evidence": "模擬音声の設定"
            }
          ],
          "model": "mock-no-api",
          "usage": {
            "input_tokens": 0,
            "output_tokens": 0
          }
        },
        {
          "clip_id": "clip-08",
          "original_name": "clip-08.mp4",
          "duration": 18,
          "width": 720,
          "height": 1280,
          "status": "analyzed",
          "sha256": "8888888888888888888888888888888888888888888888888888888888888888",
          "segments": [
            {
              "id": "seg-08",
              "start": 1,
              "end": 15,
              "shot_type": "store_cta",
              "who_visible": "none",
              "camera": {
                "stable": true,
                "dark": false,
                "blurry": false
              },
              "speech": [],
              "retake_of": null,
              "notes": "匿名の模擬素材。実際の映像の解析ではありません。"
            }
          ],
          "clip_flags": {
            "silent": true,
            "multiple_customers_suspected": false,
            "text_burned_in": false
          },
          "worry_candidates": [
            {
              "key": "asymmetry",
              "evidence": "模擬音声の設定"
            }
          ],
          "model": "mock-no-api",
          "usage": {
            "input_tokens": 0,
            "output_tokens": 0
          }
        }
      ]
    },
    "staff": {
      "member": {
        "member_id": "member-demo",
        "artist_id": "artist-demo",
        "display_name": "デモ担当",
        "store_label": "サンプル店",
        "region_label": "地域"
      },
      "inputs": {
        "worries": [
          {
            "key": "asymmetry",
            "primary": true
          }
        ],
        "visibility": "customer_face_ok",
        "region_label": "地域",
        "member_id": "member-demo",
        "artist_id": "artist-demo"
      },
      "analyses": [
        {
          "clip_id": "clip-01",
          "original_name": "clip-01.mp4",
          "duration": 18,
          "width": 720,
          "height": 1280,
          "status": "analyzed",
          "sha256": "1111111111111111111111111111111111111111111111111111111111111111",
          "segments": [
            {
              "id": "seg-01",
              "start": 1,
              "end": 15,
              "shot_type": "staff_intro",
              "who_visible": "staff_only",
              "camera": {
                "stable": true,
                "dark": false,
                "blurry": false
              },
              "speech": [
                {
                  "start": 2,
                  "end": 5,
                  "speaker": "staff",
                  "text": "左右のバランスを鏡で確認します",
                  "confidence": 0.9
                },
                {
                  "start": 6,
                  "end": 9,
                  "speaker": "staff",
                  "text": "形を相談しながら決めていきます",
                  "confidence": 0.9
                }
              ],
              "retake_of": null,
              "notes": "匿名の模擬素材。実際の映像の解析ではありません。"
            }
          ],
          "clip_flags": {
            "silent": false,
            "multiple_customers_suspected": false,
            "text_burned_in": false
          },
          "worry_candidates": [
            {
              "key": "asymmetry",
              "evidence": "模擬音声の設定"
            }
          ],
          "model": "mock-no-api",
          "usage": {
            "input_tokens": 0,
            "output_tokens": 0
          }
        },
        {
          "clip_id": "clip-02",
          "original_name": "clip-02.mp4",
          "duration": 18,
          "width": 720,
          "height": 1280,
          "status": "analyzed",
          "sha256": "2222222222222222222222222222222222222222222222222222222222222222",
          "segments": [
            {
              "id": "seg-02",
              "start": 1,
              "end": 15,
              "shot_type": "design_hands",
              "who_visible": "staff_only",
              "camera": {
                "stable": true,
                "dark": false,
                "blurry": false
              },
              "speech": [],
              "retake_of": null,
              "notes": "匿名の模擬素材。実際の映像の解析ではありません。"
            }
          ],
          "clip_flags": {
            "silent": true,
            "multiple_customers_suspected": false,
            "text_burned_in": false
          },
          "worry_candidates": [
            {
              "key": "asymmetry",
              "evidence": "模擬音声の設定"
            }
          ],
          "model": "mock-no-api",
          "usage": {
            "input_tokens": 0,
            "output_tokens": 0
          }
        },
        {
          "clip_id": "clip-03",
          "original_name": "clip-03.mp4",
          "duration": 18,
          "width": 720,
          "height": 1280,
          "status": "analyzed",
          "sha256": "3333333333333333333333333333333333333333333333333333333333333333",
          "segments": [
            {
              "id": "seg-03",
              "start": 1,
              "end": 15,
              "shot_type": "tool_prop",
              "who_visible": "none",
              "camera": {
                "stable": true,
                "dark": false,
                "blurry": false
              },
              "speech": [],
              "retake_of": null,
              "notes": "匿名の模擬素材。実際の映像の解析ではありません。"
            }
          ],
          "clip_flags": {
            "silent": true,
            "multiple_customers_suspected": false,
            "text_burned_in": false
          },
          "worry_candidates": [
            {
              "key": "asymmetry",
              "evidence": "模擬音声の設定"
            }
          ],
          "model": "mock-no-api",
          "usage": {
            "input_tokens": 0,
            "output_tokens": 0
          }
        },
        {
          "clip_id": "clip-04",
          "original_name": "clip-04.mp4",
          "duration": 18,
          "width": 720,
          "height": 1280,
          "status": "analyzed",
          "sha256": "4444444444444444444444444444444444444444444444444444444444444444",
          "segments": [
            {
              "id": "seg-04",
              "start": 1,
              "end": 15,
              "shot_type": "store_cta",
              "who_visible": "none",
              "camera": {
                "stable": true,
                "dark": false,
                "blurry": false
              },
              "speech": [],
              "retake_of": null,
              "notes": "匿名の模擬素材。実際の映像の解析ではありません。"
            }
          ],
          "clip_flags": {
            "silent": true,
            "multiple_customers_suspected": false,
            "text_burned_in": false
          },
          "worry_candidates": [
            {
              "key": "asymmetry",
              "evidence": "模擬音声の設定"
            }
          ],
          "model": "mock-no-api",
          "usage": {
            "input_tokens": 0,
            "output_tokens": 0
          }
        }
      ]
    },
    "missing": {
      "member": {
        "member_id": "member-demo",
        "artist_id": "artist-demo",
        "display_name": "デモ担当",
        "store_label": "サンプル店",
        "region_label": "地域"
      },
      "inputs": {
        "worries": [
          {
            "key": "asymmetry",
            "primary": true
          }
        ],
        "visibility": "customer_face_ok",
        "region_label": "地域",
        "member_id": "member-demo",
        "artist_id": "artist-demo"
      },
      "analyses": [
        {
          "clip_id": "clip-02",
          "original_name": "clip-02.mp4",
          "duration": 18,
          "width": 720,
          "height": 1280,
          "status": "analyzed",
          "sha256": "2222222222222222222222222222222222222222222222222222222222222222",
          "segments": [
            {
              "id": "seg-02",
              "start": 1,
              "end": 15,
              "shot_type": "face_front",
              "who_visible": "customer_face",
              "camera": {
                "stable": true,
                "dark": true,
                "blurry": false
              },
              "speech": [],
              "retake_of": null,
              "notes": "匿名の模擬素材。実際の映像の解析ではありません。"
            }
          ],
          "clip_flags": {
            "silent": true,
            "multiple_customers_suspected": false,
            "text_burned_in": false
          },
          "worry_candidates": [
            {
              "key": "asymmetry",
              "evidence": "模擬音声の設定"
            }
          ],
          "model": "mock-no-api",
          "usage": {
            "input_tokens": 0,
            "output_tokens": 0
          }
        },
        {
          "clip_id": "clip-03",
          "original_name": "clip-03.mp4",
          "duration": 18,
          "width": 720,
          "height": 1280,
          "status": "analyzed",
          "sha256": "3333333333333333333333333333333333333333333333333333333333333333",
          "segments": [
            {
              "id": "seg-03",
              "start": 1,
              "end": 15,
              "shot_type": "brow_close",
              "who_visible": "customer_partial",
              "camera": {
                "stable": true,
                "dark": false,
                "blurry": false
              },
              "speech": [],
              "retake_of": null,
              "notes": "匿名の模擬素材。実際の映像の解析ではありません。"
            }
          ],
          "clip_flags": {
            "silent": true,
            "multiple_customers_suspected": false,
            "text_burned_in": false
          },
          "worry_candidates": [
            {
              "key": "asymmetry",
              "evidence": "模擬音声の設定"
            }
          ],
          "model": "mock-no-api",
          "usage": {
            "input_tokens": 0,
            "output_tokens": 0
          }
        },
        {
          "clip_id": "clip-04",
          "original_name": "clip-04.mp4",
          "duration": 18,
          "width": 720,
          "height": 1280,
          "status": "analyzed",
          "sha256": "4444444444444444444444444444444444444444444444444444444444444444",
          "segments": [
            {
              "id": "seg-04",
              "start": 1,
              "end": 15,
              "shot_type": "consult_mid",
              "who_visible": "customer_partial",
              "camera": {
                "stable": true,
                "dark": false,
                "blurry": false
              },
              "speech": [
                {
                  "start": 2,
                  "end": 5,
                  "speaker": "staff",
                  "text": "左右のバランスを鏡で確認します",
                  "confidence": 0.9
                },
                {
                  "start": 6,
                  "end": 9,
                  "speaker": "staff",
                  "text": "形を相談しながら決めていきます",
                  "confidence": 0.9
                }
              ],
              "retake_of": null,
              "notes": "匿名の模擬素材。実際の映像の解析ではありません。"
            }
          ],
          "clip_flags": {
            "silent": false,
            "multiple_customers_suspected": false,
            "text_burned_in": false
          },
          "worry_candidates": [
            {
              "key": "asymmetry",
              "evidence": "模擬音声の設定"
            }
          ],
          "model": "mock-no-api",
          "usage": {
            "input_tokens": 0,
            "output_tokens": 0
          }
        },
        {
          "clip_id": "clip-05",
          "original_name": "clip-05.mp4",
          "duration": 18,
          "width": 720,
          "height": 1280,
          "status": "analyzed",
          "sha256": "5555555555555555555555555555555555555555555555555555555555555555",
          "segments": [
            {
              "id": "seg-05",
              "start": 1,
              "end": 15,
              "shot_type": "design_hands",
              "who_visible": "customer_partial",
              "camera": {
                "stable": true,
                "dark": false,
                "blurry": false
              },
              "speech": [],
              "retake_of": null,
              "notes": "匿名の模擬素材。実際の映像の解析ではありません。"
            }
          ],
          "clip_flags": {
            "silent": true,
            "multiple_customers_suspected": false,
            "text_burned_in": false
          },
          "worry_candidates": [
            {
              "key": "asymmetry",
              "evidence": "模擬音声の設定"
            }
          ],
          "model": "mock-no-api",
          "usage": {
            "input_tokens": 0,
            "output_tokens": 0
          }
        },
        {
          "clip_id": "clip-06",
          "original_name": "clip-06.mp4",
          "duration": 18,
          "width": 720,
          "height": 1280,
          "status": "analyzed",
          "sha256": "6666666666666666666666666666666666666666666666666666666666666666",
          "segments": [
            {
              "id": "seg-06",
              "start": 1,
              "end": 15,
              "shot_type": "procedure_wide",
              "who_visible": "customer_partial",
              "camera": {
                "stable": true,
                "dark": false,
                "blurry": false
              },
              "speech": [],
              "retake_of": null,
              "notes": "匿名の模擬素材。実際の映像の解析ではありません。"
            }
          ],
          "clip_flags": {
            "silent": true,
            "multiple_customers_suspected": false,
            "text_burned_in": false
          },
          "worry_candidates": [
            {
              "key": "asymmetry",
              "evidence": "模擬音声の設定"
            }
          ],
          "model": "mock-no-api",
          "usage": {
            "input_tokens": 0,
            "output_tokens": 0
          }
        },
        {
          "clip_id": "clip-07",
          "original_name": "clip-07.mp4",
          "duration": 18,
          "width": 720,
          "height": 1280,
          "status": "analyzed",
          "sha256": "7777777777777777777777777777777777777777777777777777777777777777",
          "segments": [
            {
              "id": "seg-07",
              "start": 1,
              "end": 15,
              "shot_type": "tool_prop",
              "who_visible": "none",
              "camera": {
                "stable": true,
                "dark": false,
                "blurry": false
              },
              "speech": [],
              "retake_of": null,
              "notes": "匿名の模擬素材。実際の映像の解析ではありません。"
            }
          ],
          "clip_flags": {
            "silent": true,
            "multiple_customers_suspected": false,
            "text_burned_in": false
          },
          "worry_candidates": [
            {
              "key": "asymmetry",
              "evidence": "模擬音声の設定"
            }
          ],
          "model": "mock-no-api",
          "usage": {
            "input_tokens": 0,
            "output_tokens": 0
          }
        },
        {
          "clip_id": "clip-09",
          "original_name": "clip-09.mp4",
          "duration": 18,
          "width": 720,
          "height": 1280,
          "status": "analyzed",
          "sha256": "9999999999999999999999999999999999999999999999999999999999999999",
          "segments": [
            {
              "id": "seg-09",
              "start": 1,
              "end": 15,
              "shot_type": "consult_mid",
              "who_visible": "customer_partial",
              "camera": {
                "stable": true,
                "dark": false,
                "blurry": false
              },
              "speech": [
                {
                  "start": 2,
                  "end": 5,
                  "speaker": "staff",
                  "text": "左右のバランスを鏡で確認します",
                  "confidence": 0.9
                },
                {
                  "start": 6,
                  "end": 9,
                  "speaker": "staff",
                  "text": "形を相談しながら決めていきます",
                  "confidence": 0.9
                }
              ],
              "retake_of": "clip-04:seg-04",
              "notes": "匿名の模擬素材。実際の映像の解析ではありません。"
            }
          ],
          "clip_flags": {
            "silent": false,
            "multiple_customers_suspected": false,
            "text_burned_in": false
          },
          "worry_candidates": [
            {
              "key": "asymmetry",
              "evidence": "模擬音声の設定"
            }
          ],
          "model": "mock-no-api",
          "usage": {
            "input_tokens": 0,
            "output_tokens": 0
          }
        },
        {
          "clip_id": "clip-10",
          "original_name": "clip-10.mp4",
          "duration": 18,
          "width": 720,
          "height": 1280,
          "status": "failed",
          "sha256": "0000000000000000000000000000000000000000000000000000000000000000",
          "segments": [],
          "clip_flags": {
            "silent": true,
            "multiple_customers_suspected": false,
            "text_burned_in": false
          },
          "worry_candidates": [
            {
              "key": "asymmetry",
              "evidence": "模擬音声の設定"
            }
          ],
          "model": "mock-no-api",
          "usage": {
            "input_tokens": 0,
            "output_tokens": 0
          },
          "error": "対応していない形式（模擬）"
        }
      ]
    }
  },
  "index": {
    "version": "2026-09-26.1",
    "generated_at": "2026-09-26T06:22:53.863Z",
    "built_from": {
      "path": "../../../analysis-output/utan-20260926/video-coach/予約優先_判断基準データ.json",
      "sha256": "5443b2a4f1ffddf4028e904a32f8c4a555412ac8c4f53ad33b60295a3a4c40ea"
    },
    "seed_from": {
      "path": "../../../analysis-output/utan-20260926/video-coach/references.js",
      "sha256": "48d36781db2e405e8c0f7ae58ea463289fd71c4e597c09c164942ac52774ce60"
    },
    "hypotheses_ids": [
      "H01",
      "H02",
      "H03",
      "H04",
      "H05",
      "H06",
      "H07",
      "H08",
      "H09",
      "H10",
      "H11",
      "H12",
      "H13",
      "H14",
      "H15",
      "H16",
      "H17",
      "H18",
      "H19",
      "H20",
      "H21",
      "H22",
      "H23",
      "H24",
      "H25",
      "H26",
      "H27",
      "H28",
      "H29",
      "H30",
      "H31",
      "H32",
      "H33",
      "H34",
      "H35",
      "H36"
    ],
    "entries": [
      {
        "id": "ref_seed_opening",
        "role": "opening",
        "shot_type": "brow_close",
        "families": [
          "R02",
          "R04"
        ],
        "code": "DdYIcKtzcor",
        "start": 1.666667,
        "end": 2.833333,
        "baseline": false,
        "hypotheses": [
          "H02",
          "H12"
        ],
        "source_sha256": "637c540c55a6f28b911b98869a3a89365751e9be2f22f7692c68815776fe5471",
        "video": "../../../analysis-output/utan-20260926/staff-guide/videos/DdYIcKtzcor.mp4",
        "poster": "../../../analysis-output/utan-20260926/staff-guide/assets/DdYIcKtzcor-50.jpg",
        "point": "完成を早めに見せる構成",
        "effect": "未検証",
        "source_pointer": "/videos/DdYIcKtzcor/shots/3"
      },
      {
        "id": "ref_seed_consult",
        "role": "consult",
        "shot_type": "consult_mid",
        "families": [
          "R03"
        ],
        "code": "Dabhwkvz_vC",
        "start": 2.966667,
        "end": 5.466667,
        "baseline": false,
        "hypotheses": [
          "H14"
        ],
        "source_sha256": "d55017cf44cba2287cd9fcad52094835c2140720233becb3f780180ae9f78d7a",
        "video": "../../../analysis-output/utan-20260926/staff-guide/videos/Dabhwkvz_vC.mp4",
        "poster": "../../../analysis-output/utan-20260926/staff-guide/assets/Dabhwkvz_vC-89.jpg",
        "point": "相談している様子を見せる",
        "effect": "未検証",
        "source_pointer": "/videos/Dabhwkvz_vC/shots/3"
      },
      {
        "id": "ref_seed_design",
        "role": "explain",
        "shot_type": "design_hands",
        "families": [
          "R03",
          "R07"
        ],
        "code": "Dabhwkvz_vC",
        "start": 9.3,
        "end": 11.566667,
        "baseline": false,
        "hypotheses": [
          "H14",
          "H18"
        ],
        "source_sha256": "d55017cf44cba2287cd9fcad52094835c2140720233becb3f780180ae9f78d7a",
        "video": "../../../analysis-output/utan-20260926/staff-guide/videos/Dabhwkvz_vC.mp4",
        "poster": "../../../analysis-output/utan-20260926/staff-guide/assets/Dabhwkvz_vC-279.jpg",
        "point": "デザインの工程と字幕の役割",
        "effect": "未検証",
        "source_pointer": "/videos/Dabhwkvz_vC/shots/8"
      },
      {
        "id": "ref_seed_detail",
        "role": "finish",
        "shot_type": "brow_close",
        "families": [
          "R04",
          "R08"
        ],
        "code": "DbS1uVlJdQY",
        "start": 12.1,
        "end": 14.033333,
        "baseline": false,
        "hypotheses": [
          "H12",
          "H19"
        ],
        "source_sha256": "e66a7d702ded98a5a335792e2a7659db0c278d0289c2c0b06e51077334a06eb9",
        "video": "../../../analysis-output/utan-20260926/staff-guide/videos/DbS1uVlJdQY.mp4",
        "poster": "../../../analysis-output/utan-20260926/staff-guide/assets/DbS1uVlJdQY-363.jpg",
        "point": "眉の細部を確認する画角",
        "effect": "未検証",
        "source_pointer": "/videos/DbS1uVlJdQY/shots/9"
      },
      {
        "id": "ref_seed_short-zoom",
        "role": "finish",
        "shot_type": "face_front",
        "families": [
          "R06"
        ],
        "code": "DdYIcKtzcor",
        "start": 23.466667,
        "end": 25.466667,
        "baseline": false,
        "hypotheses": [
          "H08",
          "H09"
        ],
        "source_sha256": "637c540c55a6f28b911b98869a3a89365751e9be2f22f7692c68815776fe5471",
        "video": "../../../analysis-output/utan-20260926/staff-guide/videos/DdYIcKtzcor.mp4",
        "poster": "../../../analysis-output/utan-20260926/staff-guide/assets/DdYIcKtzcor-704.jpg",
        "point": "急な寄りと、ゆっくりした寄りの比較",
        "effect": "未検証",
        "source_pointer": "/videos/DdYIcKtzcor/shots/18"
      },
      {
        "id": "ref_seed_short-guide",
        "role": "cta",
        "shot_type": "face_front",
        "families": [
          "R10"
        ],
        "code": "DQ86PDmk-hN",
        "start": 25.966667,
        "end": 27.200000000000003,
        "baseline": true,
        "hypotheses": [
          "H28"
        ],
        "source_sha256": "21d62c53beff0ee00569bb4ae4510a3ee367ea492e8881255ff4432b63974a1c",
        "video": "../../../analysis-output/utan-20260926/staff-guide/videos/DQ86PDmk-hN.mp4",
        "poster": "../../../analysis-output/utan-20260926/staff-guide/assets/DQ86PDmk-hN-779.jpg",
        "point": "顔と予約先を一緒に示す案内",
        "effect": "未検証",
        "source_pointer": "/videos/DQ86PDmk-hN/shots/16"
      },
      {
        "id": "ref_R01_1",
        "role": "opening",
        "shot_type": "face_front",
        "families": [
          "R01"
        ],
        "code": "DQ86PDmk-hN",
        "start": 2.233333,
        "end": 5.833333,
        "baseline": true,
        "hypotheses": [
          "H01",
          "H25"
        ],
        "source_sha256": "21d62c53beff0ee00569bb4ae4510a3ee367ea492e8881255ff4432b63974a1c",
        "video": "../../../analysis-output/utan-20260926/staff-guide/videos/DQ86PDmk-hN.mp4",
        "poster": "../../../analysis-output/utan-20260926/staff-guide/assets/DQ86PDmk-hN-67.jpg",
        "point": "言い回しと悩みの具体化を確認する参考区間",
        "effect": "未検証",
        "source_pointer": "/videos/DQ86PDmk-hN/shots/2"
      },
      {
        "id": "ref_R01_2",
        "role": "opening",
        "shot_type": "face_front",
        "families": [
          "R01"
        ],
        "code": "DbAqi9TpYGq",
        "start": 2.166667,
        "end": 5.633333,
        "baseline": false,
        "hypotheses": [
          "H01",
          "H25"
        ],
        "source_sha256": "bfc0ee03ab87392fc826daee58a8dd2c1d3dc4468f291f0ccadc758d6dc34d04",
        "video": "../../../analysis-output/utan-20260926/staff-guide/videos/DbAqi9TpYGq.mp4",
        "poster": "../../../analysis-output/utan-20260926/staff-guide/assets/DbAqi9TpYGq-65.jpg",
        "point": "言い回しと悩みの具体化を確認する参考区間",
        "effect": "未検証",
        "source_pointer": "/videos/DbAqi9TpYGq/shots/2"
      },
      {
        "id": "ref_R02_2",
        "role": "opening",
        "shot_type": "staff_intro",
        "families": [
          "R02"
        ],
        "code": "DbS1uVlJdQY",
        "start": 0,
        "end": 3.366667,
        "baseline": false,
        "hypotheses": [
          "H02",
          "H03",
          "H16",
          "H29"
        ],
        "source_sha256": "e66a7d702ded98a5a335792e2a7659db0c278d0289c2c0b06e51077334a06eb9",
        "video": "../../../analysis-output/utan-20260926/staff-guide/videos/DbS1uVlJdQY.mp4",
        "poster": "../../../analysis-output/utan-20260926/staff-guide/assets/DbS1uVlJdQY-0.jpg",
        "point": "冒頭と地域・担当者の伝え方を確認する参考区間",
        "effect": "未検証",
        "source_pointer": "/videos/DbS1uVlJdQY/shots/1"
      },
      {
        "id": "ref_R03_1",
        "role": "consult",
        "shot_type": "consult_mid",
        "families": [
          "R03"
        ],
        "code": "Dabhwkvz_vC",
        "start": 2.966667,
        "end": 5.466667,
        "baseline": false,
        "hypotheses": [
          "H14",
          "H15",
          "H30"
        ],
        "source_sha256": "d55017cf44cba2287cd9fcad52094835c2140720233becb3f780180ae9f78d7a",
        "video": "../../../analysis-output/utan-20260926/staff-guide/videos/Dabhwkvz_vC.mp4",
        "poster": "../../../analysis-output/utan-20260926/staff-guide/assets/Dabhwkvz_vC-89.jpg",
        "point": "相談の流れと構成を確認する参考区間",
        "effect": "未検証",
        "source_pointer": "/videos/Dabhwkvz_vC/shots/3"
      },
      {
        "id": "ref_R03_2",
        "role": "consult",
        "shot_type": "consult_mid",
        "families": [
          "R03"
        ],
        "code": "Dabhwkvz_vC",
        "start": 11.566667,
        "end": 19.633333,
        "baseline": false,
        "hypotheses": [
          "H14",
          "H15",
          "H30"
        ],
        "source_sha256": "d55017cf44cba2287cd9fcad52094835c2140720233becb3f780180ae9f78d7a",
        "video": "../../../analysis-output/utan-20260926/staff-guide/videos/Dabhwkvz_vC.mp4",
        "poster": "../../../analysis-output/utan-20260926/staff-guide/assets/Dabhwkvz_vC-347.jpg",
        "point": "相談の流れと構成を確認する参考区間",
        "effect": "未検証",
        "source_pointer": "/videos/Dabhwkvz_vC/shots/9"
      },
      {
        "id": "ref_R03_3",
        "role": "consult",
        "shot_type": "tool_prop",
        "families": [
          "R03"
        ],
        "code": "DcsYuD1pLVT",
        "start": 0,
        "end": 0.433333,
        "baseline": false,
        "hypotheses": [
          "H14",
          "H15",
          "H30"
        ],
        "source_sha256": "4d331bfee6161762b9c65cf2e9bb2d612747e0d8a7072db6c4d5e5b0ec9db5d9",
        "video": "../../../analysis-output/utan-20260926/staff-guide/videos/DcsYuD1pLVT.mp4",
        "poster": "../../../analysis-output/utan-20260926/staff-guide/assets/DcsYuD1pLVT-0.jpg",
        "point": "相談の流れと構成を確認する参考区間",
        "effect": "未検証",
        "source_pointer": "/videos/DcsYuD1pLVT/shots/1"
      },
      {
        "id": "ref_R04_1",
        "role": "finish",
        "shot_type": "face_front",
        "families": [
          "R04"
        ],
        "code": "Db7OhBlJMaw",
        "start": 15.266667,
        "end": 17.233333,
        "baseline": false,
        "hypotheses": [
          "H12",
          "H13",
          "H17",
          "H35"
        ],
        "source_sha256": "a4e51740556a2a2b7b2e6b711b0b61902a4183356c3be46664750c81586a349c",
        "video": "../../../analysis-output/utan-20260926/staff-guide/videos/Db7OhBlJMaw.mp4",
        "poster": "../../../analysis-output/utan-20260926/staff-guide/assets/Db7OhBlJMaw-458.jpg",
        "point": "顔全体・眉の寄り・色と角度を確認する参考区間",
        "effect": "未検証",
        "source_pointer": "/videos/Db7OhBlJMaw/shots/11"
      },
      {
        "id": "ref_R04_2",
        "role": "finish",
        "shot_type": "face_front",
        "families": [
          "R04"
        ],
        "code": "Db7OhBlJMaw",
        "start": 17.233333,
        "end": 19.133333,
        "baseline": false,
        "hypotheses": [
          "H12",
          "H13",
          "H17",
          "H35"
        ],
        "source_sha256": "a4e51740556a2a2b7b2e6b711b0b61902a4183356c3be46664750c81586a349c",
        "video": "../../../analysis-output/utan-20260926/staff-guide/videos/Db7OhBlJMaw.mp4",
        "poster": "../../../analysis-output/utan-20260926/staff-guide/assets/Db7OhBlJMaw-517.jpg",
        "point": "顔全体・眉の寄り・色と角度を確認する参考区間",
        "effect": "未検証",
        "source_pointer": "/videos/Db7OhBlJMaw/shots/12"
      },
      {
        "id": "ref_R04_3",
        "role": "finish",
        "shot_type": "brow_close",
        "families": [
          "R04"
        ],
        "code": "Db7OhBlJMaw",
        "start": 19.566667,
        "end": 21.866667,
        "baseline": false,
        "hypotheses": [
          "H12",
          "H13",
          "H17",
          "H35"
        ],
        "source_sha256": "a4e51740556a2a2b7b2e6b711b0b61902a4183356c3be46664750c81586a349c",
        "video": "../../../analysis-output/utan-20260926/staff-guide/videos/Db7OhBlJMaw.mp4",
        "poster": "../../../analysis-output/utan-20260926/staff-guide/assets/Db7OhBlJMaw-587.jpg",
        "point": "顔全体・眉の寄り・色と角度を確認する参考区間",
        "effect": "未検証",
        "source_pointer": "/videos/Db7OhBlJMaw/shots/14"
      },
      {
        "id": "ref_R05_1",
        "role": "explain",
        "shot_type": "consult_mid",
        "families": [
          "R05"
        ],
        "code": "Dabhwkvz_vC",
        "start": 11.566667,
        "end": 19.633333,
        "baseline": false,
        "hypotheses": [
          "H04",
          "H05",
          "H06",
          "H07"
        ],
        "source_sha256": "d55017cf44cba2287cd9fcad52094835c2140720233becb3f780180ae9f78d7a",
        "video": "../../../analysis-output/utan-20260926/staff-guide/videos/Dabhwkvz_vC.mp4",
        "poster": "../../../analysis-output/utan-20260926/staff-guide/assets/Dabhwkvz_vC-347.jpg",
        "point": "カット・ジェットカットを確認する参考区間",
        "effect": "未検証",
        "source_pointer": "/videos/Dabhwkvz_vC/shots/9"
      },
      {
        "id": "ref_R05_2",
        "role": "explain",
        "shot_type": "staff_intro",
        "families": [
          "R05"
        ],
        "code": "DbAqi9TpYGq",
        "start": 9.366667,
        "end": 16.666667,
        "baseline": false,
        "hypotheses": [
          "H04",
          "H05",
          "H06",
          "H07"
        ],
        "source_sha256": "bfc0ee03ab87392fc826daee58a8dd2c1d3dc4468f291f0ccadc758d6dc34d04",
        "video": "../../../analysis-output/utan-20260926/staff-guide/videos/DbAqi9TpYGq.mp4",
        "poster": "../../../analysis-output/utan-20260926/staff-guide/assets/DbAqi9TpYGq-281.jpg",
        "point": "カット・ジェットカットを確認する参考区間",
        "effect": "未検証",
        "source_pointer": "/videos/DbAqi9TpYGq/shots/5"
      },
      {
        "id": "ref_R05_3",
        "role": "explain",
        "shot_type": "face_front",
        "families": [
          "R05"
        ],
        "code": "Db7OhBlJMaw",
        "start": 19.133333,
        "end": 19.566667,
        "baseline": false,
        "hypotheses": [
          "H04",
          "H05",
          "H06",
          "H07"
        ],
        "source_sha256": "a4e51740556a2a2b7b2e6b711b0b61902a4183356c3be46664750c81586a349c",
        "video": "../../../analysis-output/utan-20260926/staff-guide/videos/Db7OhBlJMaw.mp4",
        "poster": "../../../analysis-output/utan-20260926/staff-guide/assets/Db7OhBlJMaw-574.jpg",
        "point": "カット・ジェットカットを確認する参考区間",
        "effect": "未検証",
        "source_pointer": "/videos/Db7OhBlJMaw/shots/13"
      },
      {
        "id": "ref_R06_1",
        "role": "finish",
        "shot_type": "face_front",
        "families": [
          "R06"
        ],
        "code": "Db7OhBlJMaw",
        "start": 19.133333,
        "end": 19.566667,
        "baseline": false,
        "hypotheses": [
          "H08",
          "H09",
          "H10",
          "H11"
        ],
        "source_sha256": "a4e51740556a2a2b7b2e6b711b0b61902a4183356c3be46664750c81586a349c",
        "video": "../../../analysis-output/utan-20260926/staff-guide/videos/Db7OhBlJMaw.mp4",
        "poster": "../../../analysis-output/utan-20260926/staff-guide/assets/Db7OhBlJMaw-574.jpg",
        "point": "ズームと強調を確認する参考区間",
        "effect": "未検証",
        "source_pointer": "/videos/Db7OhBlJMaw/shots/13"
      },
      {
        "id": "ref_R06_2",
        "role": "finish",
        "shot_type": "face_front",
        "families": [
          "R06"
        ],
        "code": "DbhcmcopFxX",
        "start": 3.8,
        "end": 4.966667,
        "baseline": false,
        "hypotheses": [
          "H08",
          "H09",
          "H10",
          "H11"
        ],
        "source_sha256": "77a183e75e5778a69af7e745bb65bde41fa776d3e165b7b8007803888e4bae65",
        "video": "../../../analysis-output/utan-20260926/staff-guide/videos/DbhcmcopFxX.mp4",
        "poster": "../../../analysis-output/utan-20260926/staff-guide/assets/DbhcmcopFxX-114.jpg",
        "point": "ズームと強調を確認する参考区間",
        "effect": "未検証",
        "source_pointer": "/videos/DbhcmcopFxX/shots/4"
      },
      {
        "id": "ref_R06_3",
        "role": "finish",
        "shot_type": "face_front",
        "families": [
          "R06"
        ],
        "code": "DdYIcKtzcor",
        "start": 31.666667,
        "end": 33.966666,
        "baseline": false,
        "hypotheses": [
          "H08",
          "H09",
          "H10",
          "H11"
        ],
        "source_sha256": "637c540c55a6f28b911b98869a3a89365751e9be2f22f7692c68815776fe5471",
        "video": "../../../analysis-output/utan-20260926/staff-guide/videos/DdYIcKtzcor.mp4",
        "poster": "../../../analysis-output/utan-20260926/staff-guide/assets/DdYIcKtzcor-950.jpg",
        "point": "ズームと強調を確認する参考区間",
        "effect": "未検証",
        "source_pointer": "/videos/DdYIcKtzcor/shots/23"
      },
      {
        "id": "ref_R07_1",
        "role": "explain",
        "shot_type": "staff_intro",
        "families": [
          "R07"
        ],
        "code": "DbAqi9TpYGq",
        "start": 9.366667,
        "end": 16.666667,
        "baseline": false,
        "hypotheses": [
          "H18",
          "H22"
        ],
        "source_sha256": "bfc0ee03ab87392fc826daee58a8dd2c1d3dc4468f291f0ccadc758d6dc34d04",
        "video": "../../../analysis-output/utan-20260926/staff-guide/videos/DbAqi9TpYGq.mp4",
        "poster": "../../../analysis-output/utan-20260926/staff-guide/assets/DbAqi9TpYGq-281.jpg",
        "point": "字幕の内容と出すタイミングを確認する参考区間",
        "effect": "未検証",
        "source_pointer": "/videos/DbAqi9TpYGq/shots/5"
      },
      {
        "id": "ref_R07_2",
        "role": "explain",
        "shot_type": "staff_intro",
        "families": [
          "R07"
        ],
        "code": "DbAqi9TpYGq",
        "start": 16.666667,
        "end": 25.333333,
        "baseline": false,
        "hypotheses": [
          "H18",
          "H22"
        ],
        "source_sha256": "bfc0ee03ab87392fc826daee58a8dd2c1d3dc4468f291f0ccadc758d6dc34d04",
        "video": "../../../analysis-output/utan-20260926/staff-guide/videos/DbAqi9TpYGq.mp4",
        "poster": "../../../analysis-output/utan-20260926/staff-guide/assets/DbAqi9TpYGq-500.jpg",
        "point": "字幕の内容と出すタイミングを確認する参考区間",
        "effect": "未検証",
        "source_pointer": "/videos/DbAqi9TpYGq/shots/6"
      },
      {
        "id": "ref_R08_2",
        "role": "explain",
        "shot_type": "staff_intro",
        "families": [
          "R08"
        ],
        "code": "DbAqi9TpYGq",
        "start": 16.666667,
        "end": 25.333333,
        "baseline": false,
        "hypotheses": [
          "H19",
          "H20",
          "H21"
        ],
        "source_sha256": "bfc0ee03ab87392fc826daee58a8dd2c1d3dc4468f291f0ccadc758d6dc34d04",
        "video": "../../../analysis-output/utan-20260926/staff-guide/videos/DbAqi9TpYGq.mp4",
        "poster": "../../../analysis-output/utan-20260926/staff-guide/assets/DbAqi9TpYGq-500.jpg",
        "point": "文字位置・書体・サイズ・色を確認する参考区間",
        "effect": "未検証",
        "source_pointer": "/videos/DbAqi9TpYGq/shots/6"
      },
      {
        "id": "ref_R09_1",
        "role": "explain",
        "shot_type": "consult_mid",
        "families": [
          "R09"
        ],
        "code": "Dabhwkvz_vC",
        "start": 11.566667,
        "end": 19.633333,
        "baseline": false,
        "hypotheses": [
          "H23",
          "H24",
          "H26",
          "H27"
        ],
        "source_sha256": "d55017cf44cba2287cd9fcad52094835c2140720233becb3f780180ae9f78d7a",
        "video": "../../../analysis-output/utan-20260926/staff-guide/videos/Dabhwkvz_vC.mp4",
        "poster": "../../../analysis-output/utan-20260926/staff-guide/assets/Dabhwkvz_vC-347.jpg",
        "point": "声・間・音源を確認する参考区間",
        "effect": "未検証",
        "source_pointer": "/videos/Dabhwkvz_vC/shots/9"
      },
      {
        "id": "ref_R10_2",
        "role": "cta",
        "shot_type": "face_front",
        "families": [
          "R10"
        ],
        "code": "DQ86PDmk-hN",
        "start": 25.966667,
        "end": 27.200000000000003,
        "baseline": true,
        "hypotheses": [
          "H28",
          "H36"
        ],
        "source_sha256": "21d62c53beff0ee00569bb4ae4510a3ee367ea492e8881255ff4432b63974a1c",
        "video": "../../../analysis-output/utan-20260926/staff-guide/videos/DQ86PDmk-hN.mp4",
        "poster": "../../../analysis-output/utan-20260926/staff-guide/assets/DQ86PDmk-hN-779.jpg",
        "point": "予約への案内と終わり方を確認する参考区間",
        "effect": "未検証",
        "source_pointer": "/videos/DQ86PDmk-hN/shots/16"
      }
    ],
    "skipped": [
      {
        "family": "R02",
        "code": "Dabhwkvz_vC",
        "shot": 1,
        "reason": "構図の分類を確定できないため索引から除外"
      },
      {
        "family": "R08",
        "code": "Db7OhBlJMaw",
        "shot": 16,
        "reason": "構図の分類を確定できないため索引から除外"
      },
      {
        "family": "R09",
        "code": "Dabhwkvz_vC",
        "shot": 17,
        "reason": "構図の分類を確定できないため索引から除外"
      },
      {
        "family": "R10",
        "code": "Db7OhBlJMaw",
        "shot": 16,
        "reason": "構図の分類を確定できないため索引から除外"
      }
    ]
  },
  "guide": "../../../analysis-output/utan-20260926/video-coach/materials.html",
  "mediaBase": "../tests/fixtures/video-coach"
};
