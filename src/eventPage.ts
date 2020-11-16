class MessageListener {
    listeners = {}

    add(action, func) {
        this.listeners[action] = func
    }

    listen(msg, sender, sendResponse) {
        const func = this.listeners[msg.action]
        if (func) {
            func(msg, sender, sendResponse)
        }
        return true
    }
}

const listener = new MessageListener()
listener.add('fetchInfo', async (msg, sender, sendResponse) => {
  const source = await fetch("").then(e => e.text())
  const sections = new DOMParser().parseFromString(source, "text/html").body.getElementsByTagName("section")
  const text = [...(sections as any)]
     .filter(e => e.innerHTML.includes("問題文") || e.innerHTML.includes("制約"))
     .map(e => e.innerHTML as string)
     .map(txt => {
         return txt
            .replace("\n<h3>問題文</h3>", "[*** 問題文]\n")
            .replace("<h3>制約</h3>", "[*** 制約]")
            .replace(/<p>/g, "").replace(/<\/p>/g, "")
            .replace(/<var>/g, "[$ ").replace(/<\/var>/g, " ]")
            .replace(/<li>/g, "").replace(/<\/li>/g, "")
            .replace(/<ul>/g, "").replace(/<\/ul>/g, "")
            .replace(/<code>/g, "`").replace(/<\/code>/g, "`")
            .replace(/&lt;/g, "<")
     })
     .join("")

  sendResponse({text: text })
})

console.log("hogehoge")

chrome.runtime.onMessage.addListener(listener.listen.bind(listener))

