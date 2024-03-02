import 'lazysizes'
// import a plugin
import 'lazysizes/plugins/parent-fit/ls.parent-fit'

// Note: Never import/require the *.min.js files from the npm package.

export default class RenderMessage {
  constructor(chatMessages, userId) {
    this.chatMessages = chatMessages
    this.userId = userId
  }

  getTime(timestamp) {
    const createdAt = new Date(timestamp)
    const todayObj = new Date()
    const today = todayObj.toLocaleDateString('ru-Ru', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    const date = createdAt.toLocaleDateString('ru-Ru', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    const hours = createdAt.getHours().toString().padStart(2, '0')
    const minutes = createdAt.getMinutes().toString().padStart(2, '0')
    if (date === today) {
      return `${hours}:${minutes}`
    } else {
      return `${date}\t${hours}:${minutes}`
    }
  }

  displayImageContent(message) {
    const imageDisplay = document.createElement('img')
    imageDisplay.classList.add(
      'preview-image',
      'lazyload',
      'mr-auto',
      'p-2',
      'col-6',
      'img-fluid',
    )
    imageDisplay.textContent = message.textBody
    // imageDisplay.src = message.blobContent;
    imageDisplay.setAttribute('data-src', message.blobContent)
    return imageDisplay
  }

  displayVideoContent(message) {
    const videoDisplay = document.createElement('video')
    videoDisplay.classList.add('preview-video', 'mr-auto', 'mb-2', 'col-6')
    videoDisplay.controls = true
    videoDisplay.src = message.blobContent
    return videoDisplay
  }

  displayAudioContent(message) {
    const audioDisplay = document.createElement('audio')
    audioDisplay.classList.add('preview-audio', 'mr-auto', 'mb-2', 'col-6')
    audioDisplay.controls = true
    audioDisplay.src = message.blobContent
    return audioDisplay
  }

  displayGeoPositionContent(message) {
    const geoDisplay = document.createElement('div')
    geoDisplay.classList.add('preview-geo', 'ml-auto', 'p-2', 'col-6')
    geoDisplay.id = message.id
    return geoDisplay
  }

  displayFileContent(message) {
    const fileDisplay = document.createElement('a')
    fileDisplay.classList.add(
      'preview-file',
      'd-flex',
      'justify-content-center',
      'mb-2',
      'col-4',
    )
    fileDisplay.download = message.textBody
    fileDisplay.href = message.blobContent
    fileDisplay.innerHTML = `<i class="bi bi-file-earmark-code-fill" style="font-size: 100px; color: cornflowerblue;"></i>`
    return fileDisplay
  }

  makeMapLayer(message) {
    if (typeof message.textBody === 'string') {
      const coordinates = message.textBody
        .split(':')
        .map((coord) => parseFloat(coord.trim()))

      const map = L.map(message.id).setView(coordinates, 15)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map)

      const marker = L.marker(map.getCenter()).addTo(map)
      marker.setLatLng(map.getCenter())
      const popupText = `lat ${coordinates[0].toFixed(2)}: lng ${coordinates[1].toFixed(2)}`
      marker.bindPopup(popupText).openPopup()
    }
  }

  renderTextEl(message) {
    this.textEl = document.createElement('div')
    if (message.from === this.userId) {
      this.textEl.classList.add('text-el-self', 'rounded-3', 'col-9')
      this.messageEl.classList.add('flex-row-reverse')
    } else {
      this.textEl.classList.add('text-el', 'rounded-3', 'col-9')
    }
    this.textEl.innerHTML = message.textBody
  }

  renderDateEl(message) {
    this.dateEl = document.createElement('div')
    this.dateEl.classList.add('date-el', 'col-3')
    this.dateEl.textContent = this.getTime(message.receivedAt)
  }

  renderDownloadEl(message) {
    this.downloadEl = document.createElement('a')
    if (message.from === this.userId) {
      this.downloadEl.classList.add(
        'download-el',
        'd-flex',
        'justify-content-end',
      )
    } else {
      this.downloadEl.classList.add('download-el')
    }
    this.downloadEl.href = message.blobContent
    this.downloadEl.download = message.textBody
    this.downloadEl.textContent = 'скачать'
  }

  renderChat(message) {
    this.messageEl = document.createElement('div')
    this.messageEl.classList.add(
      'row',
      'd-flex',
      'align-items-end',
      'm-md-3',
      'mb-4',
    )

    if (message.type === 'image') {
      this.messageEl.appendChild(this.displayImageContent(message))
    } else if (message.type === 'video') {
      this.messageEl.appendChild(this.displayVideoContent(message))
    } else if (message.type === 'audio') {
      this.messageEl.appendChild(this.displayAudioContent(message))
    } else if (message.type === 'geo') {
      this.messageEl.appendChild(this.displayGeoPositionContent(message))
    } else if (message.type !== 'text') {
      this.messageEl.appendChild(this.displayFileContent(message))
    }

    if (['image', 'audio', 'video'].includes(message.type)) {
      this.renderDownloadEl(message)
      this.messageEl.appendChild(this.downloadEl)
    }

    this.renderTextEl(message)
    this.messageEl.appendChild(this.textEl)

    this.renderDateEl(message)
    this.messageEl.appendChild(this.dateEl)

    this.chatMessages.appendChild(this.messageEl)
    if (message.type === 'geo') {
      this.makeMapLayer(message)
    }

    // requestAnimationFrame(() => {
    //   this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    // });

    // chat.scrollTop = chat.scrollHeight;
    // console.log("Scroll", chat.scrollTop, chat.scrollHeight)

    this.chatMessages.scrollTop = this.chatMessages.clientHeight

    // console.log("Scroll", this.chatMessages.scrollTop, this.chatMessages.scrollHeight)
    // })
    // }, 0)
  }

  clearChat() {
    this.chatMessages.innerHTML = ''
  }
}
