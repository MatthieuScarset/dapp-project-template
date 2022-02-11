class Messenger {
  constructor(domElement) {
    this.element = domElement;
  }

  initialize = () => {
    window.addEventListener("newMessage", this.onNew, true);
    document.querySelector('#messagesClearAll').addEventListener('click', this.onClickClearAll, true);
  };

  clear = () => {
    document.querySelectorAll('.message').forEach((el) => { el.remove() });
  }

  error = (content, remove = false) => {
    this.new(content, remove, 0);
  }

  new = (content, remove = false, type = 1) => {
    window.dispatchEvent(
      new CustomEvent("newMessage", {
        detail: {
          type: type,
          message: content,
          autoRemove: remove,
        },
      })
    );
  };

  // Events.
  onNew = (event) => {
    switch (event.detail.type) {
      case 1:
        console.log(event.detail.message);
        break;
      case 0:
        console.error(event.detail.message);
        break;
    }

    var closeBtn = document.createElement("button");
    closeBtn.classList = "";
    [
      "absolute",
      "-top-3",
      "-right-3",
      "bg-white",
      "rounded-md",
      "inline-flex",
      "items-center",
      "justify-center",
      "text-gray-400",
      "hover:opacity-50",
      "hover:text-gray-500",
      "hover:bg-gray-100",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-inset",
      "focus:ring-indigo-500",
    ].forEach((className) => {
      closeBtn.classList.add(className);
    });
    closeBtn.innerHTML =
      '<span class="sr-only">Close menu</span>' +
      '<svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">' +
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />' +
      "</svg>";
    closeBtn.addEventListener("click", this.onClickClose, true);

    var msgContent = document.createElement("div");
    msgContent.innerHTML = event.detail.message;

    var item = document.createElement("div");
    item.id = "message-" + (this.element.childElementCount + 1);
    item.tabIndex = 0;
    item.classList = "";
    [
      "message",
      "relative",
      "mt-3",
      "p-3",
      !Boolean(event.detail.type) ? "bg-red-500" : (event.detail.type > 1 ? "bg-teal-400" : "bg-white"),
      !Boolean(event.detail.type) ? "text-white" : "text-black",
      "rounded",
      "shadow",
      "border",
      "border-gray-400",
    ].forEach((className) => {
      item.classList.add(className);
    });
    item.appendChild(closeBtn);
    item.appendChild(msgContent);

    this.element.append(item);

    // Remove after 3s.
    if (event.detail.autoRemove) {
      setTimeout(() => {
        item.remove();
      }, 3000);
    }
  };

  onClickClose = (event) => {
    event.path.forEach((el) => {
      if (el.id && el.id.indexOf("message-") == 0) {
        el.remove();
        return;
      }
    });
  };

  onClickClearAll = (event) => {
    this.clear();
  }
}

export { Messenger };
