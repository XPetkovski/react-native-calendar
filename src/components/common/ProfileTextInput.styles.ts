import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  container: {
    height: 55,
    paddingHorizontal: 15,
    paddingTop: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  containerError: {
    borderColor: '#d71920',
  },
  label: {
    color: '#888',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    color: '#333',
    fontSize: 16,
    padding: 0,
    marginTop: Platform.OS === 'ios' ? 4 : 0,
  },
  errorText: {
    color: '#d71920',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
});