<template>
  <div>
    <h1>{{ emails.length }}</h1>
    <h1>{{ emailSelection.emails.size }}</h1>
    <input type="checkbox"
      :checked="allEmailsSelected"
      :class="[someEmailsSelected ? 'partial-check' : '']"
      @click="bulkSelect" />
  </div>
</template>

<script>
import { computed } from 'vue';
import useEmailSelection from '@/composables/useEmailSelection';

export default {
  name: 'BulkActionBar',
  props: {
    emails: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const emailSelection = useEmailSelection();
    const numberSelected = computed(() => emailSelection.emails.size);
    const numberEmails = props.emails.length;
    const allEmailsSelected = computed(() => {
      return numberSelected.value === numberEmails;
    });
    const someEmailsSelected = computed(() => {
      return numberSelected.value > 0 && numberSelected.value < numberEmails;
    });

    const bulkSelect = () => {
      if (allEmailsSelected.value) {
        emailSelection.clear();
      } else {
        emailSelection.addMultiple(props.emails);
      }
    };

    return {
      emailSelection: useEmailSelection(),
      allEmailsSelected,
      someEmailsSelected,
      bulkSelect
    };
  }
};
</script>

<style scoped></style>