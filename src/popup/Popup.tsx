import React, { useState, useEffect, useLayoutEffect } from 'react';
import "./Popup.scss";

interface TaskInfo {
  contestName?: string
  problemName?: string
  url?: string
  taskBody?: string
}

const onScraptButton = (project, contestName: string, problemName: string, url: string, taskBody: string) => {

  const title = contestName + ' ' + problemName
  const body = `[${problemName} ${url}]\n\n${taskBody}\n-------`

  const scrapBoxUrl = `https://scrapbox.io/${project}/${encodeURIComponent(title)}?body=${encodeURIComponent(body)}`
  chrome.tabs.create({
    url: scrapBoxUrl
  })
}

export default function Popup() {

  const [contestName, setContestName] = useState('')
  const [problemName, setProblemName] = useState('')
  const [url, setUrl] = useState('')
  const [taskBody, setTaskBody] = useState('')
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState('')

  useLayoutEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log(tabs[0])

      
      setContestName(/\/contests\/(.*)\/tasks/.exec(tabs[0].url)[1].toUpperCase())
      setProblemName(tabs[0].title)
      setUrl(tabs[0].url)
      
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "fetchInfo"
      }, (res) => {
        if (res) {
          setTaskBody(res.text)
        }
      });
    });
  }, [])

  useLayoutEffect(() => {
    fetch('https://scrapbox.io/api/projects')
      .then(async (res) => {
        const r = await res.json()
        console.log(r)
        setProjects(r.projects)
        setSelectedProject(r.projects[4].name)
      })
  }, [])

  return (
    <div>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css"></link>
      <div className="field">
        <label className="label">Scrapbox Project</label>
        <div className="select">
          <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
            {projects.map(p =>
              <option key={p.id} value={p.name}>{p.displayName}</option>
            )}
          </select>
        </div>
      </div>
      <div className="field">
        <label className="label">Title</label>
        <div className="content">
            {contestName} {problemName}
        </div>
      </div>

      <div className="field">
        <label className="label">URL</label>
        <div className="content">
          {url}
        </div>
      </div>

      <div className="field is-grouped is-grouped-centered">
        <div className="control">
          <button className="button is-primary" onClick={() => onScraptButton(selectedProject, contestName, problemName, url, taskBody)}>SCRAP!</button>
        </div>
      </div>
    </div>
  )
}
