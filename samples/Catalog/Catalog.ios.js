//  Copyright © 2016-2018 PSPDFKit GmbH. All rights reserved.
//
//  THIS SOURCE CODE AND ANY ACCOMPANYING DOCUMENTATION ARE PROTECTED BY INTERNATIONAL COPYRIGHT LAW
//  AND MAY NOT BE RESOLD OR REDISTRIBUTED. USAGE IS BOUND TO THE PSPDFKIT LICENSE AGREEMENT.
//  UNAUTHORIZED REPRODUCTION OR DISTRIBUTION IS SUBJECT TO CIVIL AND CRIMINAL PENALTIES.
//  This notice may not be removed from this file.
//

import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableHighlight,
  ListView,
  NativeModules,
  processColor,
  NavigatorIOS,
  Modal,
  Dimensions,
  findNodeHandle,
} from 'react-native'
const RNFS = require('react-native-fs')

import PSPDFKitView from 'react-native-pspdfkit'
const PSPDFKit = NativeModules.PSPDFKit

PSPDFKit.setLicenseKey('YOUR_LICENSE_KEY_GOES_HERE')

const pspdfkitColor = '#267AD4'
const pspdfkitColorAlpha = '#267AD450'

var examples = [
  {
    name: 'Open document using resource path',
    description: 'Open document from your resource bundle with relative path.',
    action: () => {
      PSPDFKit.present('PDFs/Annual Report.pdf', {})
    },
  },
  {
    name: 'Open document with absolute path',
    description:
      'Opens document from application Documents directory by passing the absolute path.',
    action: () => {
      const filename = 'Annual Report.pdf'

      const path = RNFS.DocumentDirectoryPath + '/' + filename
      const src = RNFS.MainBundlePath + '/PDFs/' + filename

      RNFS.exists(path)
        .then(exists => {
          if (!exists) {
            return RNFS.copyFile(src, path)
          }
        })
        .then(() => {
          PSPDFKit.present(path, {})
          PSPDFKit.setPageIndex(3, false)
        })
        .catch(err => {
          console.log(err.message, err.code)
        })
    },
  },
  {
    name: 'Configured Controller',
    description:
      'You can configure the controller with dictionary representation of the PSPDFConfiguration object.',
    action: () => {
      PSPDFKit.present('PDFs/Annual Report.pdf', {
        scrollDirection: 'horizontal',
        backgroundColor: processColor('white'),
        thumbnailBarMode: 'scrollable',
        pageTransition: 'scrollContinuous',
        scrollDirection: 'vertical',
      })
    },
  },
  {
    name: 'PDF View Component',
    description: 'Show how to use the PSPDFKitView component with NavigatorIOS.',
    action: component => {
      const nextRoute = {
        component: PSPDFKitView,
        passProps: {
          document: 'PDFs/Annual Report.pdf',
          configuration: {
            useParentNavigationBar: true,
          },
          style: { flex: 1 },
        },
      }
      component.props.navigator.push(nextRoute)
    },
  },
  {
    name: 'Change Pages Buttons',
    description:
      'Adds a toolbar at the bottom with buttons to the change pages.',
    action: component => {
      const nextRoute = {
        component: ChangePages
      }
      component.props.navigator.push(nextRoute)
    },
  },
  {
    name: 'Manual Save',
    description:
      'Adds a toolbar at the bottom with a Save button and disables automatic saving.',
    action: component => {
      const nextRoute = {
        component: ManualSave
      }
      component.props.navigator.push(nextRoute)
    },
  },
  {
    name: 'Split PDF',
    description: 'Show two PDFs side by side by using PSPDFKitView components.',
    action: component => {
      component.openModal()
    },
  },
  {
    name: 'Debug Log',
    description: 'Action used for printing stuff during development and debugging.',
    action: () => {
      console.log(PSPDFKit)
      console.log(PSPDFKit.versionString)
    },
  },
]

class ExampleList extends Component {
  openModal = () => {
    this.setState({ modalVisible: true })
  }

  closeModal = () => {
    this.setState({ modalVisible: false })
  }

  constructor(props) {
    super(props)
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      dataSource: ds.cloneWithRows(examples),
      modalVisible: false,
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Modal
          visible={this.state.modalVisible}
          animationType={'slide'}
          onRequestClose={this.closeModal}
          supportedOrientations={['portrait', 'landscape']}
        >
          <SplitPDF onClose={this.closeModal} style={{ flex: 1 }} />
        </Modal>
        <ListView
          dataSource={this.state.dataSource}
          renderHeader={this._renderHeader}
          renderRow={this._renderRow}
          renderSeparator={this._renderSeparator}
          contentContainerStyle={styles.listContainer}
          style={styles.list}
        />
      </View>
    )
  }

  _renderHeader() {
    return (
      <View style={styles.header}>
        <Image source={require('./assets/logo-flat.png')} style={styles.logo} />
        <Text style={styles.version}>{PSPDFKit.versionString}</Text>
      </View>
    )
  }

  _renderSeparator(sectionId, rowId) {
    return <View key={rowId} style={styles.separator} />
  }

  _renderRow = example => {
    return (
      <TouchableHighlight
        onPress={() => {
          example.action(this)
        }}
        style={styles.row}
        underlayColor={pspdfkitColorAlpha}
      >
        <View style={styles.rowContent}>
          <Text style={styles.name}>{example.name}</Text>
          <Text style={styles.description}>{example.description}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

class SplitPDF extends Component {
  constructor(props) {
    super(props)
    this.state = { dimensions: undefined }
  }

  render() {
    const layoutDirection = this._getOptimalLayoutDirection()
    return (
      <View
        style={{ flex: 1, flexDirection: layoutDirection, justifyContent: 'center' }}
        onLayout={this._onLayout}
      >
        <PSPDFKitView
          document={'PDFs/Annual Report.pdf'}
          configuration={{
            backgroundColor: processColor('lightgrey'),
            thumbnailBarMode: 'scrollable',
          }}
          pageIndex={4}
          showCloseButton={true}
          onCloseButtonPressed={this.props.onClose}
          style={{ flex: 1, color: pspdfkitColor }}
        />
        <PSPDFKitView
          document={'PDFs/Business Report.pdf'}
          configuration={{
            pageTransition: 'scrollContinuous',
            scrollDirection: 'vertical',
            pageMode: 'single',
          }}
          style={{ flex: 1, color: '#9932CC' }}
        />
      </View>
    )
  }

  _getOptimalLayoutDirection = () => {
    const width = this.state.dimensions
      ? this.state.dimensions.width
      : Dimensions.get('window').width
    return width > 450 ? 'row' : 'column'
  }

  _onLayout = event => {
    let { width, height } = event.nativeEvent.layout
    this.setState({ dimensions: { width, height } })
  }
}

 class ChangePages extends Component {
   constructor(props) {
     super(props)
     this.state = {
       currentPageIndex: 0,
       pageCount: 0,
     };
   }

   render() {
       return (
         <View style={{ flex: 1 }}>
           <PSPDFKitView
             document={'PDFs/Annual Report.pdf'}
             configuration={{
               backgroundColor: processColor('lightgrey'),
               thumbnailBarMode: 'scrollable',
             }}
             pageIndex={this.state.currentPageIndex}
             showCloseButton={true}
             onCloseButtonPressed={this.props.onClose}
             style={{ flex: 1, color: pspdfkitColor }}
             onStateChanged={event => {
               this.setState({
                 currentPageIndex: event.currentPageIndex,
                 pageCount: event.pageCount,
               });
             }}
           />
           <View style={{ flexDirection: 'row', height: 60, alignItems: 'center', padding: 10 }}>
             <Text>
             {"Page " + (this.state.currentPageIndex + 1) + " of " + this.state.pageCount}
            </Text>
             <View>
               <Button onPress={() => {
                   this.setState(previousState => {
                   return { currentPageIndex: previousState.currentPageIndex - 1 }
                 })
               }} disabled={this.state.currentPageIndex == 0} title="Previous Page" />
             </View>
             <View style={{ marginLeft: 10 }}>
               <Button onPress={() => {
                   this.setState(previousState => {
                   return { currentPageIndex: previousState.currentPageIndex + 1 }
                 })
               }} disabled={this.state.currentPageIndex == this.state.pageCount - 1} title="Next Page" />
             </View>
           </View>
         </View>
       )
   }
   
   _getOptimalLayoutDirection = () => {
     const width = this.state.dimensions
       ? this.state.dimensions.width
       : Dimensions.get('window').width
     return width > 450 ? 'row' : 'column'
   }

   _onLayout = event => {
     let { width, height } = event.nativeEvent.layout
     this.setState({ dimensions: { width, height } })
   }
}

class ManualSave extends Component {
  render() {
     return (
      <View style={{ flex: 1 }}>
        <PSPDFKitView
          ref="pdfView"
          document={'PDFs/Annual Report.pdf'}
          disableAutomaticSaving={true}
          configuration={{
            backgroundColor: processColor('lightgrey'),
            thumbnailBarMode: 'scrollable',
          }}
          style={{ flex: 1, color: pspdfkitColor }}
          />
          <View style={{ flexDirection: 'row', height: 60, alignItems: 'center', padding: 10 }}>
            <View>
              <Button onPress={() => {
                // Manual Save
                NativeModules.PSPDFKitViewManager.saveCurrentDocument(findNodeHandle(this.refs.pdfView));
              }} disabled={false} title="Save" />
            </View>
          </View>
        </View>
       )
     }
   _getOptimalLayoutDirection = () => {
     const width = this.state.dimensions
       ? this.state.dimensions.width
       : Dimensions.get('window').width
     return width > 450 ? 'row' : 'column'
   }

   _onLayout = event => {
     let { width, height } = event.nativeEvent.layout
     this.setState({ dimensions: { width, height } })
   }
}

export default class Catalog extends Component {
  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: ExampleList,
          title: 'PSPDFKit Catalog',
        }}
        style={{ flex: 1 }}
      />
    )
  }
}

var styles = StyleSheet.create({
  separator: {
    height: 0.5,
    backgroundColor: '#ccc',
    marginLeft: 10,
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
    backgroundColor: '#eee',
  },
  version: {
    color: '#666666',
    marginTop: 10,
    marginBottom: 20,
  },
  logo: {
    marginTop: 20,
  },
  listContainer: {
    backgroundColor: 'white',
  },
  list: {
    backgroundColor: '#eee',
  },
  name: {
    color: pspdfkitColor,
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 4,
  },
  description: {
    color: '#666666',
    fontSize: 12,
  },
  rowContent: {
    padding: 10,
  },
})
