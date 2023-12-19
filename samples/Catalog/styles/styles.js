import { StyleSheet } from 'react-native';

import { pspdfkitColor } from '../configuration/Constants';

export default StyleSheet.create({
  separator: {
    height: 0.5,
    backgroundColor: '#ccc',
    marginLeft: 10,
  },
  flex: { flex: 1 },
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
    padding: 5,
  },
  text: {
    fontSize: 16,
  },
  horizontalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  linkText: {
    color: pspdfkitColor,
    fontWeight: '500',
  },
  textInput: {
    borderColor: pspdfkitColor,
    borderWidth: 0,
    borderBottomWidth: 2,
    marginBottom: 30,
    maxWidth: 80,
    width: 100,
    flex: 1,
    textAlign: 'center',
  },
});
