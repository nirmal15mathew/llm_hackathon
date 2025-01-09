"use client"



export default function ChatInputbox({inputBoxVal, buttonClick, setVal, buttonDisabled}) {
    return <>
    <div className="flex p-4 w-full">
          <input
            type="text"
            value={inputBoxVal}
            onChange={(e) => setVal(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2 rounded-xl mr-2 bg-neutral-800 border-0 focus:ring-2 ring-neutral-500 outline-none"
          />
          <button
            onClick={buttonClick}
            className="px-4 py-2 bg-white text-slate-800 rounded-lg disabled:opacity-55"
            disabled={inputBoxVal == '' || buttonDisabled}
          >
            Send
          </button>
        </div>
    </>
}