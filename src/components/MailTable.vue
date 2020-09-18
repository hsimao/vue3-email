<template>
  <table class="mail-table">
    <tbody>
      <tr v-for="email in unarchivedEmails"
        :key="email.id"
        :class="['clickable', email.read ? 'read' : '']"
        @click="readEmail(email)">
        <td><input type="checkbox" /></td>
        <td>{{ email.from }}</td>
        <td>
          <p>
            <strong>{{ email.subject }}</strong>
          </p>
        </td>
        <td class="date">
          {{ format(new Date(email.sentAt), 'MMM do yyyy') }}
        </td>
        <td>
          <button
            @click="archiveEmail(email)">
            Archive
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { format, getTime } from 'date-fns';
import axios from 'axios';
import { ref, computed } from 'vue';

const baseUrl = 'http://localhost:3000';

export default {
  name: 'MailTable',
  async setup() {
    const { data } = await axios.get(`${baseUrl}/emails`);
    const emails = ref(data);

    const sortedEmails = computed(() => {
      return emails.value.sort((a, b) => {
        return new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime();
      });
    });

    const unarchivedEmails = computed(() => {
      return sortedEmails.value.filter(email => !email.archived);
    });

    const updateEmail = email => {
      axios.put(`${baseUrl}/emails/${email.id}`, email);
    };

    const readEmail = email => {
      email.read = true;
      updateEmail(email);
    };

    const archiveEmail = email => {
      email.archived = true;
      updateEmail(email);
    };

    return {
      format,
      getTime,
      unarchivedEmails,
      readEmail,
      archiveEmail
    };
  }
};
</script>

<style scoped>
</style>