import cssText from "data-text:~/src/style.css"
import type { PlasmoCSConfig } from "plasmo"
import React, { useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import ReadProofDataList from "./ReadProofDataList"

export const config: PlasmoCSConfig = {
  matches: ["https://mail.google.com/*"]
}

type ModalProps = {
  showFlag: boolean
  closeModal: () => void
}

export type ReadPloofData = {
  length: string
  note: string
  offset: string
  rule: string
  suggestion: string
  word: string
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export default function Modal(arg: ModalProps) {
  const { showFlag, closeModal } = arg

  const [emailContext, setEmailContext] = useState("")
  const [emailResRequest, setEmailResRequest] = useState(
    "このメールに対する返答を書いてください。"
  )
  const [chatGPTContext, setChatGPTContext] = useState("")
  const [proofreadContext, setProofreadContext] = useState<ReadPloofData[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  /**
   * 初回レンダリングのみ
   */
  useEffect(() => {
    ;(async () => {
      const context = await getContext()
      setEmailContext(context)
    })()
  }, [])

  return (
    <>
      <div
        className={`${
          showFlag ? "block" : "hidden"
        } fixed top-1/2 overflow-y-auto left-1/2 border border-gray-200 transform
        -translate-x-1/2 -translate-y-1/2   w-[700px] h-[400px]  bg-white z-50 p-6 rounded-lg shadow-2xl`}>
        <div className="w-full">
          <div className=" w-full flex items-center justify-between">
            <div className="mb-2 text-lg font-bold tracking-tight text-gray-800">
              ChatGPT for Gmail
            </div>
            <div>
              <button
                onClick={closeModal}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="defaultModal">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
          </div>
          <div id="overlay">
            <div id="modalContent" className="gap-y-2 grid">
              <div className="block text-sm font-bold text-gray-900">Email</div>
              <div>
                {emailContext && (
                  <textarea
                    cols={40}
                    rows={5}
                    className="font-medium w-full overflow-y-auto p-4 block text-base block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    value={emailContext}
                    onChange={(event) => setEmailContext(event.target.value)}
                  />
                )}
              </div>
              <div className="mt-4 block text-sm text-gray-900 font-bold">
                返答する内容を簡潔に記述してください
              </div>
              {/* 返信prompt作成部分&ChatGPTgetchボタン */}
              <div className="flex flex-nowrap">
                <div className="w-4/5">
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    value={emailResRequest}
                    onChange={(event) => setEmailResRequest(event.target.value)}
                  />
                </div>
                {isLoading ? (
                  <button
                    disabled
                    type="button"
                    className="ml-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-4 h-4 mr-3 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      />
                    </svg>
                    Loading...
                  </button>
                ) : (
                  <button
                    className="w-1/5 ml-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
                    onClick={async () => {
                      setIsLoading(true)
                      const chatGptResponse = await fetchedChatGptFromContext(
                        emailContext,
                        emailResRequest
                      )
                      setChatGPTContext(chatGptResponse)
                      console.log({
                        chatGptResponse
                      })
                      setIsLoading(false)
                    }}>
                    返信を作成
                  </button>
                )}
              </div>

              <div className="mt-4">
                {chatGPTContext && (
                  <textarea
                    cols={60}
                    rows={10}
                    className="font-medium w-full overflow-y-auto p-4 block text-base block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    value={chatGPTContext}
                    onChange={(event) => setChatGPTContext(event.target.value)}
                  />
                )}
              </div>
              <div
                className={`${
                  chatGPTContext ? "block" : "hidden"
                } flex justify-end`}>
                <button
                  className="w-1/5 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
                  onClick={async () => {
                    const proofreadResponse = await fetchedProofreadFromContext(
                      chatGPTContext
                    )

                    setProofreadContext(proofreadResponse)
                  }}>
                  校正する
                </button>
                <button
                  className="w-1/5 ml-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none"
                  onClick={() => {
                    insertContext(chatGPTContext)
                    closeModal()
                  }}>
                  挿入する
                </button>
              </div>

              {proofreadContext && (
                <ReadProofDataList data={proofreadContext} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function insertContext(context: string) {
  const replyClass = document.getElementsByClassName("Am Al editable")
  replyClass[0].textContent = context
}

/**
 * 最初にメールの内容を取得
 */
async function getContext() {
  const tabID = await fetchedContextTabID()
  const contextData = getRecievedGmailContext()
  console.log({ contextData })
  return contextData
}

/**
 * メールの内容を含んだtabIDを返す
 */
async function fetchedContextTabID() {
  const tabID = await sendToBackground({
    name: "getCurrentTabID"
  })
  return tabID
}

/**
 *メールの内容を取得する
 */
function getRecievedGmailContext(): string {
  const replyClass = document.getElementsByClassName("a3s aiL ")
  const result = removeMessagePart(replyClass)
  console.log("result", result)
  return result
}

/**
 *メールで不要な部分を削除する
 */
const removeMessagePart = (input) => {
  //最初の改行を削除
  const email = input[0].textContent.replace(/^\n+/g, "")
  //最後の不要な文を削除
  const messageToRemove =
    /\.{3}\[メッセージの一部が表示されています\]\s{1,}メッセージ全体を表示/
  return email.replace(messageToRemove, "")
}

/**
 * ChatGPTからの返答を受け取る
 */
async function fetchedChatGptFromContext(
  emailContext: string,
  emailResRequest: string
) {
  const tabID = await sendToBackground({
    name: "getCurrentTabID"
  })
  // chatGPTからの返答を受け取る
  const res = await sendToBackground({
    name: "generateContextWIthChatGpt",
    tabId: tabID,
    body: {
      email: emailContext,
      request: emailResRequest
    }
  })
  return res
}

async function fetchedProofreadFromContext(
  chatGptResponse: string
): Promise<ReadPloofData[]> {
  const tabID = await sendToBackground({
    name: "getCurrentTabID"
  })
  const res = await sendToBackground({
    name: "generateContext",
    tabId: tabID,
    body: {
      text: chatGptResponse
    }
  })
  console.log({
    generated: res
  })
  return JSON.parse(res)
}
