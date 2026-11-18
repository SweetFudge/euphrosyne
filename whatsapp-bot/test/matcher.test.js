import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isFromTarget, isMentioned, isGroupAllowed, pickReply, parseList } from '../src/matcher.js';

test('isFromTarget : numéro, LID, device suffix', () => {
  const target = { number: '+33 6 12 34 56 78', lid: '99887766@lid' };
  assert.ok(isFromTarget({ senderIds: ['33612345678:5@s.whatsapp.net'] }, target));
  assert.ok(isFromTarget({ senderIds: ['99887766@lid'] }, target));
  assert.ok(!isFromTarget({ senderIds: ['33699999999@s.whatsapp.net'] }, target));
});

test('isMentioned : tag réel, LID, texte', () => {
  const me = { myIds: ['33600000000:3@s.whatsapp.net', '55@lid'], myNames: ['Adriano'] };
  assert.ok(isMentioned({ mentionedJids: ['33600000000@s.whatsapp.net'] }, me));
  assert.ok(isMentioned({ mentionedJids: ['55@lid'] }, me));
  assert.ok(isMentioned({ text: 'hey @Adriano tu viens ?' }, me));
  assert.ok(isMentioned({ text: 'Adriano ?' }, me));
  assert.ok(!isMentioned({ text: 'adrianovich' }, me));
  assert.ok(!isMentioned({ mentionedJids: ['1@s.whatsapp.net'], text: 'salut' }, me));
});

test('isGroupAllowed', () => {
  assert.ok(isGroupAllowed({ jid: 'a@g.us' }, { groupIds: [], groupNames: [] }));
  assert.ok(isGroupAllowed({ jid: 'a@g.us' }, { groupIds: ['a@g.us'], groupNames: [] }));
  assert.ok(isGroupAllowed({ jid: 'b@g.us', subject: 'Les Potes 🍻' }, { groupIds: [], groupNames: ['potes'] }));
  assert.ok(!isGroupAllowed({ jid: 'b@g.us', subject: 'Famille' }, { groupIds: [], groupNames: ['potes'] }));
});

test('pickReply évite de répéter', () => {
  for (let i = 0; i < 50; i++) assert.notEqual(pickReply(['a', 'b', 'c'], 'a'), 'a');
  assert.equal(pickReply([], null), null);
});

test('parseList', () => {
  assert.deepEqual(parseList(' a, b ,,c '), ['a', 'b', 'c']);
});
