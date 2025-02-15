import React from 'react';
import { Label } from './Label';

export default {
  title: 'Components/Atoms/Label',
  component: Label,
  argTypes: {
    children: { control: 'text', defaultValue: 'LabelStory' },
    required: { control: 'boolean' },
    htmlFor: { control: 'text', defaultValue: 'attribut obligatoire htmlFor' },
  },
};

const Template = (args) => <Label {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: `Exemple de label`,
  required: false,
};
