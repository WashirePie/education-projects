import Octicon from '@/components/Octicon.vue'
import { mount } from '@vue/test-utils';

describe('Octicon.vue', () => {
  it('should mount without errors', () => {
    mount(Octicon, { props: { octicon: 'pencil', size: 16 } })
    mount(Octicon, { props: { octicon: 'pencil', size: 24 } })
    mount(Octicon, { props: { octicon: 'alert', size: 16 } })
    mount(Octicon, { props: { octicon: 'alert', size: 24 } })
    mount(Octicon, { props: { octicon: 'package', size: 16 } })
    mount(Octicon, { props: { octicon: 'package', size: 24 } })
    mount(Octicon, { props: { octicon: 'check', size: 16 } })
    mount(Octicon, { props: { octicon: 'check', size: 24 } })
    mount(Octicon, { props: { octicon: 'chevron-up', size: 16 } })
    mount(Octicon, { props: { octicon: 'chevron-up', size: 24 } })
    mount(Octicon, { props: { octicon: 'chevron-down', size: 16 } })
    mount(Octicon, { props: { octicon: 'chevron-down', size: 24 } })
    mount(Octicon, { props: { octicon: 'download', size: 16 } })
    mount(Octicon, { props: { octicon: 'download', size: 24 } })
    mount(Octicon, { props: { octicon: 'person', size: 16 } })
    mount(Octicon, { props: { octicon: 'person', size: 24 } })
    mount(Octicon, { props: { octicon: 'pin', size: 16 } })
    mount(Octicon, { props: { octicon: 'pin', size: 24 } })
    mount(Octicon, { props: { octicon: 'plus', size: 16 } })
    mount(Octicon, { props: { octicon: 'plus', size: 24 } })
    mount(Octicon, { props: { octicon: 'trash', size: 16 } })
    mount(Octicon, { props: { octicon: 'trash', size: 24 } })
    mount(Octicon, { props: { octicon: 'x', size: 16 } })
    mount(Octicon, { props: { octicon: 'x', size: 24 } })
    mount(Octicon, { props: { octicon: 'hourglass', size: 16 } })
    mount(Octicon, { props: { octicon: 'hourglass', size: 24 } })
  })
});
