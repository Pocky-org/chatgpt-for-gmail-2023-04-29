import cssText from "data-text:~/src/style.css"
import { PlasmoCSConfig } from "plasmo"
import React from "react"
import { useState } from "react"

export const config: PlasmoCSConfig = {
  matches: ["https://mail.google.com/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

type AlertProps = {
  isShowAlert: boolean
}

const AlertSecuritySection: React.FC<AlertProps> = (props) => {
  return (
    <>
      {props.isShowAlert && (
        <div>
          <div
            className="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
            role="alert">
            <svg
              aria-hidden="true"
              className="flex-shrink-0 inline w-5 h-5 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd"></path>
            </svg>
            <span className="sr-only">Info</span>
            <div>
              <span className="font-medium text-sm">Warning!</span>{" "}
              メールアドレスや電話番号が含まれている可能性があります！
              <br />
              返信を作成
              (ChatGPTに送信)する前に、不必要な個人情報の削除を推奨いたします。
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default AlertSecuritySection