import React from 'react';
import { Trans } from '@lingui/macro';
import Page from '../../components/Page/Page';
import HomeDash from './homeDash';

class Dashboard extends React.Component {
  render() {
    return (
      <Page inner>
        <Trans>
          <HomeDash />
        </Trans>
      </Page>
    );
  }
}

export default Dashboard;
