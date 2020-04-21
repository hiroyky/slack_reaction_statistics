import { assert } from 'chai'
import SlackCalcService from '../../src/service/slack-calc-service'
import { ConversationItem } from '../../src/types'

describe("SlackCalcService", () => {
    describe("filterTargetChannels", () => {
        it('include, exclude両方', () => {
            const service = new SlackCalcService()

            const allChannels: any[] = [
                { id: 'id1' },
                { id: 'id2' },
                { id: 'id3' },
                { id: 'id4' },
                { id: 'id5' },
            ]

            const includes = [ 'id1', 'id2', 'id_xx' ]
            const excluces = [ 'id4', 'id5', 'id_yy' ]

            const actual = service.filterTargetChannels(allChannels, includes, excluces)
            const expected: any[] = [
                { id: 'id1' },
                { id: 'id2' },
            ]

            assert.deepEqual(actual, expected)
        })

        it('includeのみ', () => {
            const service = new SlackCalcService()

            const allChannels: any[] = [
                { id: 'id1' },
                { id: 'id2' },
                { id: 'id3' },
                { id: 'id4' },
                { id: 'id5' },
            ]

            const includes = [ 'id1', 'id2', 'id_xx' ]
            const excluces = new Array<string>()

            const actual = service.filterTargetChannels(allChannels, includes, excluces)
            const expected: any[] = [
                { id: 'id1' },
                { id: 'id2' },
            ]

            assert.deepEqual(actual, expected)
        })

        it('excludeのみ', () => {
            const service = new SlackCalcService()

            const allChannels: any[] = [
                { id: 'id1' },
                { id: 'id2' },
                { id: 'id3' },
                { id: 'id4' },
                { id: 'id5' },
            ]

            const includes = new Array<string>()
            const excluces = [ 'id4', 'id5', 'id_yy' ]

            const actual = service.filterTargetChannels(allChannels, includes, excluces)
            const expected: any[] = [
                { id: 'id1' },
                { id: 'id2' },
                { id: 'id3' },
            ]

            assert.deepEqual(actual, expected)
        })

        it('両方とも未指定', () => {
            const service = new SlackCalcService()

            const allChannels: any[] = [
                { id: 'id1' },
                { id: 'id2' },
                { id: 'id3' },
                { id: 'id4' },
                { id: 'id5' },
            ]

            const includes = new Array<string>()
            const excluces = new Array<string>()

            const actual = service.filterTargetChannels(allChannels, includes, excluces)
            const expected: any[] = [
                { id: 'id1' },
                { id: 'id2' },
                { id: 'id3' },
                { id: 'id4' },
                { id: 'id5' },
            ]

            assert.deepEqual(actual, expected)
        })
    })

    describe('sortByReaction', () => {
        it('ソート', () => {
            const items: any[] = [
                {
                    history: {
                        reactions: [
                            {count: 10},
                            {count: 5},
                            {count: 5},
                        ],
                    }
                },
                {
                    history: {
                        reactions: [
                            {count: 1},
                        ],
                    }
                },
                {
                    history: {
                        reactions: [
                            {count: 2},
                            {count: 5},
                        ],
                    }
                },
            ]

            const service = new SlackCalcService()
            const actual = service.sortByReaction(items)
            const expected: any[] = [
                {
                    history: {
                        reactions: [
                            {count: 10},
                            {count: 5},
                            {count: 5},
                        ],
                    }
                },
                {
                    history: {
                        reactions: [
                            {count: 2},
                            {count: 5},
                        ],
                    }
                },
                {
                    history: {
                        reactions: [
                            {count: 1},
                        ],
                    }
                },
            ]
            assert.deepEqual(actual, expected)
        })
    })

    describe('extractTopItems', () => {
        it('よくあるパターン', () => {
            const items: any[] = [
                {
                    history: {
                        reactions: [
                            {count: 10},
                            {count: 5},
                            {count: 5},
                        ],
                    }
                },
                {
                    history: {
                        reactions: [
                            {count: 10},
                        ],
                    }
                },
                {
                    history: {
                        reactions: [
                            {count: 9},
                            {count: 5},
                        ],
                    }
                },
                {
                    history: {
                        reactions: [
                            {count: 14},
                        ],
                    }
                },
                {
                    history: {
                        reactions: [
                            {count: 7},
                            {count: 7},
                        ],
                    }
                },
                {
                    history: {
                        reactions: [
                            {count: 7},
                            {count: 6},
                        ],
                    }
                },
            ]

            const service = new SlackCalcService()
            const actual = service.extractTopItems(items, 3)
            const expected: any[] = [
                {
                    history: {
                        reactions: [
                            {count: 10},
                            {count: 5},
                            {count: 5},
                        ],
                    }
                },
                {
                    history: {
                        reactions: [
                            {count: 10},
                        ],
                    }
                },
                {
                    history: {
                        reactions: [
                            {count: 9},
                            {count: 5},
                        ],
                    }
                },
                {
                    history: {
                        reactions: [
                            {count: 14},
                        ],
                    }
                },
                {
                    history: {
                        reactions: [
                            {count: 7},
                            {count: 7},
                        ],
                    }
                },
            ]

            assert.deepEqual(actual, expected)
        })
    })
})