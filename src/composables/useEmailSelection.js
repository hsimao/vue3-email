import { reactive } from 'vue';
import axios from 'axios';

const baseUrl = 'http://localhost:3000';

const emails = reactive(new Set());

function emailSelection() {
  const toggle = email => {
    if (emails.has(email)) {
      emails.delete(email);
    } else {
      emails.add(email);
    }
  };

  const clear = () => {
    emails.clear();
  };

  const addMultiple = newEmails => {
    newEmails.forEach(email => emails.add(email));
  };

  const forSelected = fn => {
    emails.forEach(email => {
      fn(email);
      axios.put(`${baseUrl}/emails/${email.id}`, email);
    });
    clear();
  };

  const markRead = () => forSelected(email => (email.read = true));
  const markUnread = () => forSelected(email => (email.read = false));
  const archive = () => forSelected(email => (email.archived = true));

  return {
    emails,
    toggle,
    clear,
    addMultiple,
    markRead,
    markUnread,
    archive
  };
}

export default emailSelection;
