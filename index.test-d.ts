import {expectType} from 'tsd';
import findCacheDirectory from './index.js';

expectType<string | undefined>(findCacheDirectory({name: 'find-cache-dir'}));
expectType<string | undefined>(findCacheDirectory({name: 'find-cache-dir', files: '/foo'}));
expectType<string | undefined>(findCacheDirectory({name: 'find-cache-dir', files: ['/bar']}));
expectType<string | undefined>(findCacheDirectory({name: 'find-cache-dir', cwd: '/fooz'}));
expectType<string | undefined>(findCacheDirectory({name: 'find-cache-dir', create: true}));
expectType<string | undefined>(findCacheDirectory({name: 'find-cache-dir', thunk: true}));
