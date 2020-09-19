<template>
  <button @click="selectScreen('inbox')"
    :disabled="selectedScreen === 'inbox'">Inbox</button>
  <button @click="selectScreen('archive')"
    :disabled="selectedScreen === 'archive'">Archived</button>
  <BulkActionBar :emails="filteredEmails" />
  <table class="mail-table">
    <tbody>
      <tr v-for="email in filteredEmails"
        :key="email.id"
        :class="['clickable', email.read ? 'read' : '']">
        <td>
          <input type="checkbox"
            @click="emailSelection.toggle(email)"
            :checked="emailSelection.emails.has(email)" />
        </td>
        <td @click="openEmail(email)">{{ email.from }}</td>
        <td @click="openEmail(email)">
          <p><strong>{{ email.subject }}</strong></p>
        </td>
        <td class="date"
          @click="openEmail(email)">
          {{ format(new Date(email.sentAt), 'MMM do yyyy') }}
        </td>
        <td>
          <button @click="archiveEmail(email)">Archive</button>
        </td>
      </tr>
    </tbody>
  </table>
  <ModalView v-if="currentEmail"
    @closeModal="currentEmail = null">
    <MailView :email="currentEmail"
      @changeEmail="changeEmail" />
  </ModalView>
</template>

<script>
import { format, getTime } from 'date-fns';
import axios from 'axios';
import { ref, reactive, computed } from 'vue';
import MailView from '@/components/MailView.vue';
import ModalView from '@/components/ModalView';
import BulkActionBar from '@/components/BulkActionBar';
import useEmailSelection from '@/composables/useEmailSelection';
const baseUrl = 'http://localhost:3000';

export default {
  name: 'MailTable',
  components: {
    MailView,
    ModalView,
    BulkActionBar
  },
  async setup() {
    const { data } = await axios.get(`${baseUrl}/emails`);
    const emails = ref(data);
    const selectedScreen = ref('inbox');
    const emailSelection = useEmailSelection();

    const selectScreen = newScreen => {
      selectedScreen.value = newScreen;
      emailSelection.clear();
    };

    const sortedEmails = computed(() => {
      return emails.value.sort((a, b) => {
        return new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime();
      });
    });

    const filteredEmails = computed(() => {
      if (selectedScreen.value === 'inbox') {
        return sortedEmails.value.filter(email => !email.archived);
      } else {
        return sortedEmails.value.filter(email => email.archived);
      }
    });

    const updateEmail = email => {
      axios.put(`${baseUrl}/emails/${email.id}`, email);
    };

    const currentEmail = ref(null);
    const openEmail = email => {
      currentEmail.value = email;
      if (email) {
        email.read = true;
        updateEmail(email);
      }
    };

    const archiveEmail = email => {
      email.archived = true;
      updateEmail(email);
    };

    const toggleRead = email => {
      email.read = !email.read;
      updateEmail(email);
    };

    const toggleArchive = email => {
      email.archived = !email.archived;
      updateEmail(email);
    };

    const changeEmail = ({
      toggleRead,
      toggleArchive,
      save,
      closeModal,
      changeIndex
    }) => {
      const email = currentEmail.value;
      if (toggleRead) email.read = !email.read;
      if (toggleArchive) email.archived = !email.archived;
      if (save) updateEmail(email);
      if (closeModal) currentEmail.value = null;

      // change current open email to next or perv
      if (changeIndex) {
        const emails = filteredEmails.value;
        const currentIndex = emails.indexOf(currentEmail.value);
        const newEmail = emails[currentIndex + changeIndex];
        currentEmail.value = newEmail;
      }
    };

    return {
      format,
      getTime,
      filteredEmails,
      openEmail,
      archiveEmail,
      currentEmail,
      changeEmail,
      selectScreen,
      selectedScreen,
      emailSelection
    };
  }
};
</script>

<style scoped></style>
